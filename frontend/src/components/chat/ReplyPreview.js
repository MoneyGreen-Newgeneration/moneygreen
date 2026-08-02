export default function ReplyPreview({ replyingTo, onCancel }) {
  if (!replyingTo) return null;

  const author = replyingTo.sender === "client" ? "vous-m
ê
me" : "Support";

  return (
    <div className="chat-reply-bar">
      <div>
        <span className="chat-reply-author">R
é
pondre 
à
 {author}</span>

        <span className="chat-reply-text">
          {replyingTo.deleted ? "Message supprim
é
" : replyingTo.text || "Photo"}
        </span>
      </div>

      <button onClick={onCancel} title="Annuler">
        
✕
      </button>
    </div>
  );
}
