export default function DashboardNotice({ icon, message, onClose }) {
  return (
    <div className="dash-notice mg-enter" role="status">
      {icon && <span className="dash-notice-icon" aria-hidden="true">{icon}</span>}
      <p className="dash-notice-message">{message}</p>
      <button type="button" className="dash-notice-close" aria-label="Fermer" onClick={onClose}>
        ×
      </button>
    </div>
  );
}
