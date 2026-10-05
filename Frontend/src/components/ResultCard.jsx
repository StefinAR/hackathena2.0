import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
} from "lucide-react";

function ResultCard({
  prediction = "No Threat",
  confidence = 0,
  packetsAnalyzed = 0,
  requestRate = 0,
}) {
  const isThreat = prediction.toLowerCase() !== "normal";
  const isSuspicious =
    prediction.toLowerCase() === "suspicious";

  const Icon = isThreat
    ? isSuspicious
      ? AlertTriangle
      : ShieldAlert
    : ShieldCheck;

  const statusClass = isThreat
    ? isSuspicious
      ? "result-warning"
      : "result-danger"
    : "result-success";

  return (
    <div className={`result-card ${statusClass}`}>
      <div className="result-header">
        <div className="result-icon">
          <Icon size={28} />
        </div>

        <div>
          <p className="result-label">Detection Result</p>
          <h2>{prediction}</h2>
        </div>
      </div>

      <div className="result-details">
        <div className="result-detail">
          <span>Confidence</span>
          <strong>{confidence}%</strong>
        </div>

        <div className="result-detail">
          <span>Packets Analyzed</span>
          <strong>{packetsAnalyzed.toLocaleString()}</strong>
        </div>

        <div className="result-detail">
          <span>Request Rate</span>
          <strong>{requestRate.toLocaleString()}/sec</strong>
        </div>
      </div>
    </div>
  );
}

export default ResultCard;