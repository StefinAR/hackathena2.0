import { useState } from "react";
import { useDetections } from "../context/useDetection";
import {
  AlertTriangle,
  CheckCircle,
  ShieldAlert,
} from "lucide-react";

import "../styles/History.css";



function History() {
  const { detections } = useDetections();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredDetections = detections.filter((detection) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      detection.source.toLowerCase().includes(searchText) ||
      detection.destination.toLowerCase().includes(searchText) ||
      detection.protocol.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      detection.type === statusFilter;

    return matchesSearch && matchesStatus;
  });
  return (
    <div className="history-page">

      <div className="history-header">
        <div>
          <h2>Detection History</h2>

          <p>
            View previous network traffic analyses and detected threats.
          </p>
        </div>

        <div className="history-count">
          {detections.length} Records
        </div>
      </div>

      <div className="history-summary">

  <SummaryCard
    icon={<CheckCircle size={21} />}
    title="Normal"
    value={detections.filter(
      (detection) => detection.type === "Normal"
    ).length}
    type="normal"
  />

  <SummaryCard
    icon={<AlertTriangle size={21} />}
    title="Suspicious"
    value={detections.filter(
      (detection) => detection.type === "Suspicious"
    ).length}
    type="suspicious"
  />

  <SummaryCard
    icon={<ShieldAlert size={21} />}
    title="Malicious"
    value={detections.filter(
      (detection) => detection.type === "Malicious"
    ).length}
    type="malicious"
  />

</div>

      <div className="history-card">

        <div className="history-card-header">

  <div>
    <h3>Previous Detections</h3>

    <p>
      Network activity analyzed by NetShield.
    </p>
  </div>

  <div className="history-filters">

    <input
      type="text"
      placeholder="Search traffic..."
      value={search}
      onChange={(event) => setSearch(event.target.value)}
    />

    <select
      value={statusFilter}
      onChange={(event) => setStatusFilter(event.target.value)}
    >
      <option value="All">All Status</option>
      <option value="Normal">Normal</option>
      <option value="Suspicious">Suspicious</option>
      <option value="Malicious">Malicious</option>
    </select>
    <button
  type="button"
  className="clear-filters"
  onClick={() => {
    setSearch("");
    setStatusFilter("All");
  }}
>
  Clear
</button>
  </div>

</div>

        <div className="history-table-wrapper">

          <table className="history-table">

            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Source</th>
                <th>Destination</th>
                <th>Protocol</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
  {filteredDetections.length > 0 ? (
    filteredDetections.map((detection) => (
      <tr key={detection.id}>

        <td>{detection.date}</td>

        <td>{detection.time}</td>

        <td>{detection.source}</td>

        <td>{detection.destination}</td>

        <td>
          <span className="protocol">
            {detection.protocol}
          </span>
        </td>

        <td>
          <StatusBadge type={detection.type} />
        </td>

      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="6" className="no-results">
        No matching detections found.
      </td>
    </tr>
  )}
</tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

function SummaryCard({ icon, title, value, type }) {
  return (
    <div className={`history-summary-card ${type}`}>

      <div className="summary-icon">
        {icon}
      </div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>

    </div>
  );
}

function StatusBadge({ type }) {
  const icons = {
    Normal: <CheckCircle size={14} />,
    Suspicious: <AlertTriangle size={14} />,
    Malicious: <ShieldAlert size={14} />,
  };

  return (
    <span
      className={`history-status ${type.toLowerCase()}`}
    >
      {icons[type]}
      {type}
    </span>
  );
}

export default History;