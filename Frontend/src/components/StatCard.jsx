import {
  Activity,
  Gauge,
  ShieldAlert,
  Server,
} from "lucide-react";

const icons = {
  packets: Activity,
  requests: Gauge,
  threats: ShieldAlert,
  status: Server,
};

function StatCard({ title, value, description, type }) {
  const Icon = icons[type] || Activity;

  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div>
          <p className="stat-title">{title}</p>
          <h2 className="stat-value">{value}</h2>
        </div>

        <div className="stat-icon">
          <Icon size={24} />
        </div>
      </div>

      <p className="stat-description">{description}</p>
    </div>
  );
}

export default StatCard;