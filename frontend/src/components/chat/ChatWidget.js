import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLang } from "../../context/LangContext";
import useChat from "../../hooks/useChat";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import ReplyPreview from "./ReplyPreview";
import "./Chat.css";

export default function ChatWidget() {
  const { user } = useAuth();
  const { t } = useLang();

  const chat = useChat(user);

  const {
    open,
    setOpen,
    messages,
    text,
    uploading,
    adminOnline,
    adminLastSeen,
    adminTyping,
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
  } = chat;

  const unreadCount = messages.filter(m => m.sender === "admin" && !m.read).length;

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, adminTyping, bottomRef]);

  useEffect(() => {
    if (!open || !messagesContainerRef.current) return;
    seenIdsRef.current = new Set();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-msg-id");
            const sender = entry.target.getAttribute("data-msg-sender");
            const isRead = entry.target.getAttribute("data-msg-read") === "true";
            if (id && sender === "admin" && !isRead && !seenIdsRef.current.has(id)) {
              seenIdsRef.current.add(id);
              markRead(id);
            }
          }
        });
      },
      { root: messagesContainerRef.current, threshold: 0.6 }
    );

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user]);

  useEffect(() => {
    if (!open || !observerRef.current || !messagesContainerRef.current) return;
    const nodes = messagesContainerRef.current.querySelectorAll("[data-msg-id]");
    nodes.forEach(node => observerRef.current.observe(node));
  }, [messages, open, observerRef, messagesContainerRef]);

  if (!user || user.isAdmin) return null;

  return (
    <div className="chat-widget">
      {open && (
        <div className="chat-overlay" onClick={() => setOpen(false)} />
      )}
      <div className={`chat-panel ${open ? "chat-panel-open" : ""}`}>
        <ChatHeader
          adminOnline={adminOnline}
          adminLastSeen={adminLastSeen}
          formatLastSeen={formatLastSeen}
          onClose={() => setOpen(false)}
          t={t}
        />
        <ChatMessages
          messages={messages}
          adminTyping={adminTyping}
          uploading={uploading}
          bottomRef={bottomRef}
          messagesContainerRef={messagesContainerRef}
          setReplyingTo={setReplyingTo}
          handleDelete={handleDelete}
          t={t}
        />
        <ReplyPreview
          replyingTo={replyingTo}
          onCancel={() => setReplyingTo(null)}
        />
        <ChatInput
          text={text}
          setText={handleTextChange}
          handleKey={handleKey}
          handlePickImage={handlePickImage}
          handleFileChange={handleFileChange}
          handleSend={sendMessage}
          uploading={uploading}
          fileInputRef={fileInputRef}
          t={t}
        />
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
      <button className="chat-bubble" onClick={() => setOpen(o => !o)}>
        {open ? "âœ•" : "ðŸ’¬"}
        {!open && unreadCount > 0 && (
          <span className="chat-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
        )}
      </button>
    </div>
  );
}
