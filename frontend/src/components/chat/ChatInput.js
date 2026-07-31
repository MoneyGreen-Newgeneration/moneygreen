export default function ChatInput({
  text,
  setText,
  handleKey,
  handlePickImage,
  handleFileChange,
  handleSend,
  uploading,
  fileInputRef,
  placeholder,
  sendLabel,
}) {
  return (
    <div className="chat-input-row">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <button
        onClick={handlePickImage}
        className="chat-attach"
        disabled={uploading}
        title="Envoyer une photo"
      >
        📎
      </button>

      <input
        type="text"
        placeholder={placeholder || "Écrire un message..."}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKey}
        className="chat-input"
      />

      <button
        onClick={handleSend}
        disabled={!text.trim() && !uploading}
        className="chat-send"
      >
        {sendLabel || "Envoyer"}
      </button>
    </div>
  );
}
