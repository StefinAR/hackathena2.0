import {
  Activity,
  Database,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDetections } from "../context/useDetection";
import "../styles/Dashboard.css";

const trafficData = [
  { time: "10:00", traffic: 12 },
  { time: "10:05", traffic: 18 },
  { time: "10:10", traffic: 15 },
  { time: "10:15", traffic: 24 },
  { time: "10:20", traffic: 21 },
  { time: "10:25", traffic: 29 },
  { time: "10:30", traffic: 25 },
];

function Dashboard() {
  const { detections } = useDetections();
  const threatData = [
  {
    name: "Normal",
    value: detections.filter(
      (detection) => detection.type === "Normal"
    ).length,
  },
  {
    name: "Suspicious",
    value: detections.filter(
      (detection) => detection.type === "Suspicious"
    ).length,
  },
  {
    name: "Malicious",
    value: detections.filter(
      (detection) => detection.type === "Malicious"
    ).length,
  },
];
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2>Security Dashboard</h2>
          <p>
            Monitor your network traffic and security status.
          </p>
        </div>

        <div className="dashboard-live">
          <span></span>
          Live Monitoring
        </div>
      </div>

      <section className="stats-grid">
        <StatCard
  title="Network Traffic"
  value={`${detections.length} Records`}
  subtitle="Total analyzed traffic"
  icon={<Activity size={22} />}
/>

<StatCard
  title="Packets Analyzed"
  value={detections.length}
  subtitle="Total detections analyzed"
  icon={<Database size={22} />}
/>

<StatCard
  title="Threats Detected"
  value={
    detections.filter(
      (detection) =>
        detection.type === "Suspicious" ||
        detection.type === "Malicious"
    ).length
  }
  subtitle="Suspicious and malicious traffic"
  icon={<ShieldAlert size={22} />}
/>

        <StatCard
  title="Normal Traffic"
  value={
    detections.length > 0
      ? `${Math.round(
          (detections.filter(
            (detection) => detection.type === "Normal"
          ).length /
            detections.length) *
            100
        )}%`
      : "0%"
  }
  subtitle="Based on analyzed traffic"
  icon={<ShieldCheck size={22} />}
/>
      </section>

      <section className="charts-grid">
        <div className="dashboard-card traffic-card">
          <div className="card-header">
            <div>
              <h3>Network Traffic</h3>
              <p>Traffic volume over the last 30 minutes</p>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficData}>
                <CartesianGrid stroke="#1f2937" />

                <XAxis
                  dataKey="time"
                  stroke="#64748b"
                />

                <YAxis stroke="#64748b" />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="traffic"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3>Traffic Classification</h3>
              <p>Current traffic distribution</p>
            </div>
          </div>

          <div className="pie-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={threatData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  <Cell fill="#22c55e" />
                  <Cell fill="#f59e0b" />
                  <Cell fill="#ef4444" />
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="legend">
            <div>
              <span className="legend-dot normal"></span>
              Normal
            </div>

            <div>
              <span className="legend-dot suspicious"></span>
              Suspicious
            </div>

            <div>
              <span className="legend-dot malicious"></span>
              Malicious
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-card detections-card">
        <div className="card-header">
          <div>
            <h3>Recent Detections</h3>
            <p>Latest network activity analyzed by NetShield</p>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Source</th>
                <th>Destination</th>
                <th>Protocol</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
  {detections.length > 0 ? (
    detections.slice(0, 4).map((detection) => (
      <tr key={detection.id}>
        <td>{detection.time}</td>
        <td>{detection.source}</td>
        <td>{detection.destination}</td>
        <td>{detection.protocol}</td>
        <td>
          <span
            className={`detection-status ${detection.type.toLowerCase()}`}
          >
            {detection.type}
          </span>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5" className="dashboard-empty">
        No network detections available yet.
      </td>
    </tr>
  )}
</tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span>{title}</span>

        <div className="stat-icon">
          {icon}
        </div>
      </div>

      <strong>{value}</strong>

      <small>{subtitle}</small>
    </div>
  );
}

export default Dashboard;