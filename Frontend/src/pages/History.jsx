import { useEffect, useState } from "react";

import {
  CheckCircle,
  ShieldAlert,
} from "lucide-react";

import { getDetectionHistory } from "../api/api";

import "../styles/History.css";

function getDisplayStatus(status) {
  switch (status?.toLowerCase()) {
    case "normal":
      return "Normal";

    case "ddos_attack":
    case "ddos attack":
    case "malicious":
      return "Malicious";

    default:
      return status || "Unknown";
  }
}

function History() {
  const [detections, setDetections] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    async function loadHistory() {
      try {
        setLoading(true);
        setError("");

        const data = await getDetectionHistory();

        setDetections(data.detections || []);

      } catch (err) {
        console.error("Failed to load detection history:", err);
        setError("Failed to load detection history.");
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);


  const filteredDetections = detections.filter((detection) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      detection.filename?.toLowerCase().includes(searchText) ||
      getDisplayStatus(detection.status)
        .toLowerCase()
        .includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      getDisplayStatus(detection.status) === statusFilter;

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
          value={
            detections.filter(
              (detection) =>
                getDisplayStatus(detection.status) === "Normal"
            ).length
          }
          type="normal"
        />


        <SummaryCard
          icon={<ShieldAlert size={21} />}
          title="Malicious"
          value={
            detections.filter(
              (detection) =>
                getDisplayStatus(detection.status) === "Malicious"
            ).length
          }
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
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
            >
              <option value="All">All Status</option>
              <option value="Normal">Normal</option>
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
                <th>Filename</th>
                <th>Packets</th>
                <th>DDoS %</th>
                <th>Status</th>
              </tr>
            </thead>


            <tbody>

              {loading ? (

                <tr>
                  <td colSpan="6" className="no-results">
                    Loading detection history...
                  </td>
                </tr>

              ) : error ? (

                <tr>
                  <td colSpan="6" className="no-results">
                    {error}
                  </td>
                </tr>

              ) : filteredDetections.length > 0 ? (

                filteredDetections.map((detection) => (

                  <tr key={detection.id}>

                    <td>
                      {detection.date}
                    </td>

                    <td>
                      {detection.time}
                    </td>

                    <td>
                      {detection.filename || "-"}
                    </td>

                    <td>
                      {detection.packets ?? 0}
                    </td>

                    <td>
                      {detection.ddos_percentage !== undefined
                        ? `${detection.ddos_percentage}%`
                        : "-"}
                    </td>

                    <td>
                      <StatusBadge
                        type={getDisplayStatus(detection.status)}
                      />
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
    Malicious: <ShieldAlert size={14} />,
  };


  return (
    <span
      className={`history-status ${type?.toLowerCase()}`}
    >
      {icons[type]}
      {type}
    </span>
  );
}


export default History;