import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { API_URL, SOCKET_URL } from "../config";

let socket;
let typingTimeout;
export default function useChat(user) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [adminOnline, setAdminOnline] = useState(false);
  const [adminLastSeen, setAdminLastSeen] = useState(null);
  const [adminTyping, setAdminTyping] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const observerRef = useRef(null);
  const seenIdsRef = useRef(new Set());

  useEffect(() => {
  if (!user) return;

  const token = localStorage.getItem("token");

  socket = io(SOCKET_URL, { auth: { token } });

  socket.emit("join");

  fetch(`${API_URL}/chat/${user.id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((r) => r.json())
    .then((data) => {
      setMessages(Array.isArray(data) ? data : []);
    });

  socket.on("new_message", (msg) => {
    setMessages((prev) => [...prev, msg]);

    if (msg.sender === "admin") {
      setAdminTyping(false);
    }
  });

  socket.on("messages_read", ({ reader }) => {
    if (reader === "admin") {
      setMessages((prev) =>
        prev.map((m) =>
          m.sender === "client"
            ? { ...m, read: true }
            : m
        )
      );
    }
  });

  socket.on("message_deleted", ({ messageId }) => {
    setMessages((prev) =>
      prev.map((m) =>
        m._id === messageId
          ? {
              ...m,
              deleted: true,
              text: "",
              imageUrl: null,
            }
          : m
      )
    );
  });

  socket.on("admin_status", ({ online, lastSeen }) => {
    setAdminOnline(online);

    if (lastSeen) {
      setAdminLastSeen(lastSeen);
    }
  });

  socket.on("typing", ({ sender }) => {
    if (sender === "admin") {
      setAdminTyping(true);
    }
  });

  socket.on("stop_typing", ({ sender }) => {
    if (sender === "admin") {
      setAdminTyping(false);
    }
  });

  return () => socket.disconnect();
}, [user]);

const sendMessage = () => {
  if (!text.trim()) return;

  socket.emit("client_message", {
    text,
    replyTo: replyingTo?._id || null,
  });

  setText("");
  setReplyingTo(null);

  clearTimeout(typingTimeout);

  socket.emit("stop_typing", {});
};

// Emet "typing" pendant la frappe, puis "stop_typing" apres 1.5s d'inactivite
const handleTextChange = (value) => {
  setText(value);
  socket.emit("typing", {});
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit("stop_typing", {});
  }, 1500);
};

const handleKey = (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
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

    const res = await fetch(
      `${API_URL}/upload/chat-image`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      }
    );

    const data = await res.json();

    if (data.imageUrl) {
      socket.emit("client_message", {
        text: "",
        imageUrl: data.imageUrl,
        replyTo: replyingTo?._id || null,
      });

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
  if (msg.sender !== "client" || msg.deleted) return;
  setConfirmDelete(msg);
};

const confirmDeleteMessage = () => {
  if (!confirmDelete) return;
  socket.emit("delete_message", {
    messageId: confirmDelete._id,
    userId: user.id,
  });
  setConfirmDelete(null);
};

const cancelDelete = () => setConfirmDelete(null);

// A appeler quand un message admin devient visible a l'ecran (accuse de lecture)
const markRead = (messageId) => {
  socket.emit("mark_read", { userId: user.id, reader: "client" });
  setMessages((prev) => prev.map((m) => (m._id === messageId ? { ...m, read: true } : m)));
};

useEffect(() => {
  if (open) {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }
}, [messages, open, adminTyping]);

const formatLastSeen = (d) => {
  if (!d) return "";

  const date = new Date(d);

  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

  return {
    open,
    setOpen,
    messages,
    setMessages,
    text,
    setText,
    uploading,
    setUploading,
    adminOnline,
    setAdminOnline,
    adminLastSeen,
    setAdminLastSeen,
    adminTyping,
    setAdminTyping,
    replyingTo,
    setReplyingTo,
    bottomRef,
    fileInputRef,
    messagesContainerRef,
    observerRef,
    seenIdsRef,

    sendMessage,
    handleTextChange,
    handleKey,
    handlePickImage,
    handleFileChange,
    handleDelete,
    confirmDelete,
    confirmDeleteMessage,
    cancelDelete,
    markRead,
    formatLastSeen,
  };
}
