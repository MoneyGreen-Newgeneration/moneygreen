export default function ChatHeader({
  icon,
  title,
  online,
  statusText,
  onClose,
}) {
  return (
    <div className="chat-header">
      <div className="chat-header-info">
        <span>
          {icon} {title}
        </span>

        {statusText && (
          <span className="chat-status-line">
            <span className={`chat-status-dot ${online ? "online" : ""}`} />
            {statusText}
          </span>
        )}
      </div>

      {onClose && (
        <button className="chat-close" onClick={onClose} title="Fermer">
          ✕
        </button>
      )}
    </div>
  );
}
