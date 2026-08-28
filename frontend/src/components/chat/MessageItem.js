import LinkifiedText from "./LinkifiedText";

export default function MessageItem({
  msg,
  onReply,
  onDelete,
}) {
  return (
    <div
  data-msg-id={msg._id}
  data-msg-sender={msg.sender}
  data-msg-read={msg.read ? "true" : "false"}
  className={`chat-msg ${
    msg.sender === "client" ? "chat-msg-client" : "chat-msg-admin"
  } ${msg.deleted ? "chat-msg-deleted" : ""}`}
>
  {!msg.deleted && (
  <div className="chat-msg-actions">
    <button onClick={() => onReply(msg)} title="Répondre">
      ↩
    </button>

    {msg.sender === "client" && (
      <button onClick={() => onDelete(msg)} title="Supprimer">
        🗑️
      </button>
    )}
  </div>
)}
  {msg.replyPreview?.sender && !msg.deleted && (
  <div className="chat-reply-preview">
    <span className="chat-reply-author">
      {msg.replyPreview.sender === "client" ? "Vous" : "Support"}
    </span>

    <span className="chat-reply-text">
      {msg.replyPreview.text || "Photo"}
    </span>
  </div>
)}
  {msg.deleted ? (
  <span className="chat-deleted-text">Message supprimé</span>
) : (
  <>
    {msg.imageUrl && (
      <a href={msg.imageUrl} target="_blank" rel="noreferrer">
        <img
          src={msg.imageUrl}
          alt="envoyée"
          className="chat-msg-image"
        />
      </a>
    )}

    {msg.text && <span className="chat-msg-text"><LinkifiedText text={msg.text} /></span>}
  </>
)}
  <span className="chat-time">
  {new Date(msg.createdAt).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  })}

  {msg.sender === "client" && !msg.deleted && (
    <span className={`chat-check ${msg.read ? "read" : ""}`}>
      {msg.read ? "✓✓" : "✓"}
    </span>
  )}
</span>

</div>
  );
}