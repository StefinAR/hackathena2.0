import { LoaderCircle, CheckCircle, XCircle } from "lucide-react";

function AnalysisStatus({ status }) {
  if (!status) {
    return null;
  }

  const statusConfig = {
    analyzing: {
      icon: LoaderCircle,
      title: "Analyzing Network Traffic",
      message: "Processing the uploaded traffic data...",
      className: "analysis-status analyzing",
    },

    completed: {
      icon: CheckCircle,
      title: "Analysis Complete",
      message: "Network traffic analysis has finished.",
      className: "analysis-status completed",
    },

    error: {
      icon: XCircle,
      title: "Analysis Failed",
      message: "Something went wrong while analyzing the file.",
      className: "analysis-status error",
    },
  };

  const config = statusConfig[status];

  if (!config) {
    return null;
  }

  const Icon = config.icon;

  return (
    <div className={config.className}>
      <Icon size={22} className="analysis-status-icon" />

      <div>
        <h3>{config.title}</h3>
        <p>{config.message}</p>
      </div>
    </div>
  );
}

export default AnalysisStatus;