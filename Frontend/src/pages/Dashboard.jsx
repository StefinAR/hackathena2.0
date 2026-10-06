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

function Dashboard() {
  const { detections } = useDetections();

  // --------------------------------
  // Statistics
  // --------------------------------

  const totalAnalyses = detections.length;

  const totalPackets = detections.reduce(
    (total, detection) =>
      total + Number(detection.packets || 0),
    0
  );

  const threatsDetected = detections.filter(
    (detection) =>
      detection.type === "Suspicious" ||
      detection.type === "Malicious"
  ).length;

  const normalCount = detections.filter(
    (detection) => detection.type === "Normal"
  ).length;

  const normalPercentage =
    totalAnalyses > 0
      ? Math.round((normalCount / totalAnalyses) * 100)
      : 0;

  // --------------------------------
  // Pie chart
  // --------------------------------

  const threatData = [
    {
      name: "Normal",
      value: normalCount,
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

  // --------------------------------
  // Network traffic chart
  // --------------------------------

  const trafficData = [...detections]
    .slice()
    .reverse()
    .map((detection) => ({
      time: detection.time,
      traffic: Number(detection.packets || 0),
    }));

  return (
    <div className="dashboard">

      {/* ================= HEADER ================= */}

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


      {/* ================= STAT CARDS ================= */}

      <section className="stats-grid">

        <StatCard
          title="Network Traffic"
          value={`${totalAnalyses} Files`}
          subtitle="Total analyzed files"
          icon={<Activity size={22} />}
        />

        <StatCard
          title="Packets Analyzed"
          value={totalPackets}
          subtitle="Total packets analyzed"
          icon={<Database size={22} />}
        />

        <StatCard
          title="Threats Detected"
          value={threatsDetected}
          subtitle="Suspicious and malicious files"
          icon={<ShieldAlert size={22} />}
        />

        <StatCard
          title="Normal Traffic"
          value={`${normalPercentage}%`}
          subtitle="Based on analyzed files"
          icon={<ShieldCheck size={22} />}
        />

      </section>


      {/* ================= CHARTS ================= */}

      <section className="charts-grid">

        {/* NETWORK TRAFFIC */}

        <div className="dashboard-card traffic-card">

          <div className="card-header">

            <div>
              <h3>Network Traffic</h3>

              <p>
                Packets analyzed per uploaded file
              </p>
            </div>

          </div>

          <div className="chart-container">

            {trafficData.length > 0 ? (

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

            ) : (

              <div className="dashboard-empty">
                No traffic data available yet.
              </div>

            )}

          </div>

        </div>


        {/* CLASSIFICATION */}

        <div className="dashboard-card">

          <div className="card-header">

            <div>
              <h3>Traffic Classification</h3>

              <p>
                Current traffic distribution
              </p>
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


      {/* ================= RECENT DETECTIONS ================= */}

      <section className="dashboard-card detections-card">

        <div className="card-header">

          <div>

            <h3>Recent Detections</h3>

            <p>
              Latest network files analyzed by NetShield
            </p>

          </div>

        </div>


        <div className="table-wrapper">

          <table>

            <thead>

              <tr>
                <th>Time</th>
                <th>Filename</th>
                <th>Packets</th>
                <th>DDoS %</th>
                <th>Status</th>
              </tr>

            </thead>


            <tbody>

              {detections.length > 0 ? (

                detections.slice(0, 4).map((detection) => (

                  <tr key={detection.id}>

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
                      {detection.ddosPercentage !== undefined
                        ? `${detection.ddosPercentage}%`
                        : "-"}
                    </td>

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

                  <td
                    colSpan="5"
                    className="dashboard-empty"
                  >
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


function StatCard({
  title,
  value,
  subtitle,
  icon,
}) {

  return (

    <div className="stat-card">

      <div className="stat-card-top">

        <span>
          {title}
        </span>

        <div className="stat-icon">
          {icon}
        </div>

      </div>

      <strong>
        {value}
      </strong>

      <small>
        {subtitle}
      </small>

    </div>

  );
}


export default Dashboard;