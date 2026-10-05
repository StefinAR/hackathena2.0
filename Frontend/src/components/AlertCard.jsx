import { ShieldAlert, X } from "lucide-react";

function AlertCard({
  title = "Security Alert",
  message = "Potential malicious network activity detected.",
  severity = "danger",
}) {
  const severityClass =
    severity === "warning"
      ? "alert-card-warning"
      : "alert-card-danger";

  return (
    <div className={`alert-card ${severityClass}`}>
      <div className="alert-card-icon">
        <ShieldAlert size={22} />
      </div>

      <div className="alert-card-content">
        <h3>{title}</h3>
        <p>{message}</p>
      </div>

      <button
        type="button"
        className="alert-close"
        aria-label="Close alert"
      >
        <X size={18} />
      </button>
    </div>
  );
}

export default AlertCard;