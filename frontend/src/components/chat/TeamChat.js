import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { API_URL } from "../../config";
import "./Chat.css";

export default function TeamChat({ socket, messages, setMessages }) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetch(`${API_URL}/teamchat`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(r => r.json())
      .then(data => setMessages(Array.isArray(data) ? data : []));
  }, [setMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;
    socket.emit("team_message", { senderId: user?.id, senderName: user?.username, text });
    setText("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handlePickImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image trop volumineuse (max 5 Mo).");
      e.target.value = "";
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${API_URL}/upload/chat-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });
      const data = await res.json();

      if (data.imageUrl) {
        socket.emit("team_message", { senderId: user?.id, senderName: user?.username, text: "", imageUrl: data.imageUrl });
      }
    } catch {
      alert("Erreur lors de l'envoi de l'image.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="adm-chat adm-team-chat">
      <div className="adm-chat-main" style={{ gridColumn: "1 / -1" }}>
        <div className="adm-chat-header">
          <span>👥 Chat equipe admin</span>
        </div>
        <div className="adm-chat-messages">
          {messages.length === 0 && (
            <p className="chat-empty">Aucun message pour le moment.</p>
          )}
          {messages.map((msg, i) => {
            const isMine = msg.senderId === user?.id || msg.senderId?._id === user?.id;
            return (
              <div
                key={msg._id || i}
                className={`chat-msg ${isMine ? "chat-msg-client" : "chat-msg-admin"}`}
              >
                {!isMine && <span className="adm-team-sender">{msg.senderName}</span>}
                {msg.imageUrl && (
                  <a href={msg.imageUrl} target="_blank" rel="noreferrer">
                    <img src={msg.imageUrl} alt="envoyée" className="chat-msg-image" />
                  </a>
                )}
                {msg.text && <span className="chat-msg-text">{msg.text}</span>}
                <span className="chat-time">
                  {new Date(msg.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            );
          })}
          {uploading && <p className="chat-uploading">Envoi en cours...</p>}
          <div ref={bottomRef} />
        </div>
        <div className="chat-input-row">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <button onClick={handlePickImage} className="chat-attach" disabled={uploading} title="Envoyer une photo">
            📎
          </button>
          <input
            type="text"
            placeholder="Écrire un message à l'équipe..."
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKey}
            className="chat-input"
          />
          <button onClick={sendMessage} className="chat-send">Envoyer</button>
        </div>
      </div>
    </div>
  );
}

