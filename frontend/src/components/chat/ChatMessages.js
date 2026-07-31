import MessageItem from "./MessageItem";

export default function ChatMessages({
  messages,
  adminTyping,
  uploading,
  bottomRef,
  messagesContainerRef,
  setReplyingTo,
  handleDelete,
  t,
}) {
  return (
    <div className="chat-messages" ref={messagesContainerRef}>
      {messages.length === 0 && <p className="chat-empty">{t("chat_empty")}</p>}

      {messages.map((msg, i) => (
        <MessageItem
          key={msg._id || i}
          msg={msg}
          onReply={setReplyingTo}
          onDelete={handleDelete}
        />
      ))}

      {adminTyping && (
        <div className="chat-typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}

      {uploading && <p className="chat-uploading">{t("chat_uploading")}</p>}

      <div ref={bottomRef} />
    </div>
  );
}