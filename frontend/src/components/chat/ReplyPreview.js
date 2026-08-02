export default function ReplyPreview({ replyingTo, onCancel }) {
  if (!replyingTo) return null;

  const author = replyingTo.sender === "client" ? "vous-même" : "Support";

  return (
    <div className="chat-reply-bar">
      <div>
        <span className="chat-reply-author">Répondre à {author}</span>

        <span className="chat-reply-text">
          {replyingTo.deleted ? "Message supprimé" : replyingTo.text || "Photo"}
        </span>
      </div>

      <button onClick={onCancel} title="Annuler">
        ✕
      </button>
    </div>
  );
}