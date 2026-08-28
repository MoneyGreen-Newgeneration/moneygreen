import { useEffect, useRef, useState } from "react";
import { useLang } from "../../context/LangContext";
import { API_URL } from "../../config";
import LinkifiedText from "./LinkifiedText";
import "./Chat.css";

let typingTimeout;

export default function AdminChat({
  users,
  conversations,
  socket,
  selectedUserId,
  setSelectedUserId,
  messages,
  setMessages,
  onlineMap,
}) {
  const { t } = useLang();
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [clientTyping, setClientTyping] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const observerRef = useRef(null);
  const seenIdsRef = useRef(new Set());

  useEffect(() => {
    if (!selectedUserId) return;
    setReplyingTo(null);
    setClientTyping(false);
    fetch(`${API_URL}/chat/${selectedUserId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(r => r.json())
      .then(data => setMessages(Array.isArray(data) ? data : []));
  }, [selectedUserId, setMessages]);

  useEffect(() => {
    if (!socket) return;

    const onTyping = ({ userId, sender }) => {
      if (userId === selectedUserId && sender === "client") setClientTyping(true);
    };
    const onStopTyping = ({ userId, sender }) => {
      if (userId === selectedUserId && sender === "client") setClientTyping(false);
    };
    const onDeleted = ({ messageId, userId }) => {
      if (userId === selectedUserId) {
        setMessages(prev => prev.map(m => m._id === messageId ? { ...m, deleted: true, text: "", imageUrl: null } : m));
      }
    };
    const onMessagesRead = ({ userId, reader }) => {
      if (userId === selectedUserId && reader === "client") {
        setMessages(prev => prev.map(m => m.sender === "admin" ? { ...m, read: true } : m));
      }
    };

    socket.on("typing", onTyping);
    socket.on("stop_typing", onStopTyping);
    socket.on("message_deleted", onDeleted);
    socket.on("messages_read", onMessagesRead);

    return () => {
      socket.off("typing", onTyping);
      socket.off("stop_typing", onStopTyping);
      socket.off("message_deleted", onDeleted);
      socket.off("messages_read", onMessagesRead);
    };
  }, [socket, selectedUserId, setMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, clientTyping]);

  useEffect(() => {
    if (!selectedUserId || !messagesContainerRef.current) return;
    seenIdsRef.current = new Set();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-msg-id");
            const sender = entry.target.getAttribute("data-msg-sender");
            const isRead = entry.target.getAttribute("data-msg-read") === "true";
            if (id && sender === "client" && !isRead && !seenIdsRef.current.has(id)) {
              seenIdsRef.current.add(id);
              socket?.emit("mark_read", { userId: selectedUserId, reader: "admin" });
              setMessages(prev => prev.map(m => m._id === id ? { ...m, read: true } : m));
            }
          }
        });
      },
      { root: messagesContainerRef.current, threshold: 0.6 }
    );

    return () => observerRef.current?.disconnect();
  }, [selectedUserId, socket, setMessages]);

  useEffect(() => {
    if (!observerRef.current || !messagesContainerRef.current) return;
    const nodes = messagesContainerRef.current.querySelectorAll("[data-msg-id]");
    nodes.forEach(node => observerRef.current.observe(node));
  }, [messages]);

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (!selectedUserId) return;
    socket.emit("typing", { userId: selectedUserId, sender: "admin" });
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit("stop_typing", { userId: selectedUserId, sender: "admin" });
    }, 1500);
  };

  const sendMessage = () => {
    if (!text.trim() || !selectedUserId) return;
    socket.emit("admin_message", { userId: selectedUserId, text, replyTo: replyingTo?._id || null });
    setText("");
    setReplyingTo(null);
    clearTimeout(typingTimeout);
    socket.emit("stop_typing", { userId: selectedUserId, sender: "admin" });
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handlePickImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedUserId) return;

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
        socket.emit("admin_message", { userId: selectedUserId, text: "", imageUrl: data.imageUrl, replyTo: replyingTo?._id || null });
        setReplyingTo(null);
      }
    } catch {
      alert("Erreur lors de l'envoi de l'image.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = (msg) => {
    if (msg.sender !== "admin" || msg.deleted) return;
    setConfirmDelete(msg);
  };

  const confirmDeleteMessage = () => {
    if (!confirmDelete) return;
    socket.emit("delete_message", { messageId: confirmDelete._id, userId: selectedUserId });
    setConfirmDelete(null);
  };

  const cancelDelete = () => setConfirmDelete(null);

  const formatLastSeen = (d) => {
    if (!d) return "";
    const date = new Date(d);
    return date.toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  };

  const selectedUser = users.find(u => u._id === selectedUserId);
  const getUnread = (uid) => conversations.find(c => c.userId === uid)?.unread || 0;
  const selectedStatus = onlineMap[selectedUserId];

  return (
    <div className="adm-chat">
      <div className="adm-chat-sidebar">
        <p className="adm-chat-sidebar-title">{t("adm_conversations")}</p>
        {users.filter(u => !u.isAdmin).map(u => {
          const unread = getUnread(u._id);
          const status = onlineMap[u._id];
          return (
            <div
              key={u._id}
              className={`adm-chat-user ${selectedUserId === u._id ? "active" : ""}`}
              onClick={() => setSelectedUserId(u._id)}
            >
              <span className="adm-name">
                <span className={`chat-status-dot ${status?.online ? "online" : ""}`}></span>
                {u.username}
              </span>
              <span className="adm-sub">{u.email}</span>
              {unread > 0 && (
                <span className="adm-chat-badge">{unread > 9 ? "9+" : unread}</span>
              )}
            </div>
          );
        })}
        {users.filter(u => !u.isAdmin).length === 0 && (
          <p className="adm-empty">{t("adm_no_client")}</p>
        )}
      </div>

      <div className="adm-chat-main">
        {!selectedUserId ? (
          <p className="adm-chat-placeholder">{t("adm_select_client")}</p>
        ) : (
          <>
            <div className="adm-chat-header">
              <div className="chat-header-info">
                <span>💬 {selectedUser?.username}</span>
                <span className="chat-status-line">
                  <span className={`chat-status-dot ${selectedStatus?.online ? "online" : ""}`}></span>
                  {selectedStatus?.online ? "En ligne" : selectedStatus?.lastSeen ? `Vu ${formatLastSeen(selectedStatus.lastSeen)}` : "Hors ligne"}
                </span>
              </div>
            </div>
            <div className="adm-chat-messages" ref={messagesContainerRef}>
              {messages.length === 0 && (
                <p className="chat-empty">{t("adm_no_message")}</p>
              )}
              {messages.map((msg, i) => (
                <div
                  key={msg._id || i}
                  data-msg-id={msg._id}
                  data-msg-sender={msg.sender}
                  data-msg-read={msg.read ? "true" : "false"}
                  className={`chat-msg ${msg.sender === "admin" ? "chat-msg-client" : "chat-msg-admin"} ${msg.deleted ? "chat-msg-deleted" : ""}`}
                >
                  {!msg.deleted && (
                    <div className="chat-msg-actions">
                      <button onClick={() => setReplyingTo(msg)} title="Répondre">↩</button>
                      {msg.sender === "admin" && (
                        <button onClick={() => handleDelete(msg)} title="Supprimer">🗑</button>
                      )}
                    </div>
                  )}
                  {msg.replyPreview?.text && !msg.deleted && (
                    <div className="chat-reply-preview">
                      <span className="chat-reply-author">{msg.replyPreview.sender === "admin" ? "Vous" : selectedUser?.username}</span>
                      <span className="chat-reply-text">{msg.replyPreview.text}</span>
                    </div>
                  )}
                  {msg.deleted ? (
                    <span className="chat-deleted-text">Message supprimé</span>
                  ) : (
                    <>
                      {msg.imageUrl && (
                        <a href={msg.imageUrl} target="_blank" rel="noreferrer">
                          <img src={msg.imageUrl} alt="envoyée" className="chat-msg-image" />
                        </a>
                      )}
                      {msg.text && <span className="chat-msg-text"><LinkifiedText text={msg.text} /></span>}
                    </>
                  )}
                  <span className="chat-time">
                    {new Date(msg.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    {msg.sender === "admin" && !msg.deleted && (
                      <span className={`chat-check ${msg.read ? "read" : ""}`}>{msg.read ? "✓✓" : "✓"}</span>
                    )}
                  </span>
                </div>
              ))}
              {clientTyping && (
                <div className="chat-typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              )}
              {uploading && <p className="chat-uploading">{t("chat_uploading")}</p>}
              <div ref={bottomRef} />
            </div>
            {replyingTo && (
              <div className="chat-reply-bar">
                <div>
                  <span className="chat-reply-author">Répondre à {replyingTo.sender === "admin" ? "vous-même" : selectedUser?.username}</span>
                  <span className="chat-reply-text">{replyingTo.deleted ? "Message supprimé" : (replyingTo.text || "Photo")}</span>
                </div>
                <button onClick={() => setReplyingTo(null)}>✕</button>
              </div>
            )}
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
                placeholder={t("adm_reply_placeholder")}
                value={text}
                onChange={handleTextChange}
                onKeyDown={handleKey}
                className="chat-input"
              />
              <button onClick={sendMessage} className="chat-send">{t("chat_send")}</button>
            </div>
          </>
        )}
      </div>
      {confirmDelete && (
        <div className="chat-confirm-overlay">
          <div className="chat-confirm-box">
            <p>Supprimer ce message ?</p>
            <div className="chat-confirm-actions">
              <button className="chat-confirm-cancel" onClick={cancelDelete}>Annuler</button>
              <button className="chat-confirm-ok" onClick={confirmDeleteMessage}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}