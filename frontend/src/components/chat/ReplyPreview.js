export default function ReplyPreview({ replyingTo, onCancel }) {
  if (!replyingTo) return null;

  const author = replyingTo.sender === "client" ? "vous-mÃªme" : "Support";

  return (
    <div className="chat-reply-bar">
      <div>
        <span className="chat-reply-author">RÃ©pondre Ã  {author}</span>

        <span className="chat-reply-text">
          {replyingTo.deleted ? "Message supprimÃ©" : replyingTo.text || "Photo"}
        </span>
      </div>

      <button onClick={onCancel} title="Annuler">
        âœ•
      </button>
    </div>
  );
}