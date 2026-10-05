import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import TrafficChart from "../components/TrafficChart";
import TrafficClassification from "../components/TrafficClassification";

function Dashboard() {
  return (
    <div className="app">
      <Navbar />

      <div className="app-body">
        <Sidebar />

        <main className="main-content">
          <div className="page-header">
            <h1>Security Dashboard</h1>

            <p>
              Monitor network traffic and detect potential DoS attacks.
            </p>
          </div>

          <div className="stats-grid">
            <StatCard
              title="Packets Analyzed"
              value="12,540"
              description="Total packets processed"
              type="packets"
            />

            <StatCard
              title="Requests/sec"
              value="1,250"
              description="Current request rate"
              type="requests"
            />

            <StatCard
              title="Threats Detected"
              value="7"
              description="Potential attacks detected"
              type="threats"
            />

            <StatCard
              title="System Status"
              value="Online"
              description="Detection system operational"
              type="status"
            />
          </div>

          <div className="charts-grid">
  <TrafficChart />
  <TrafficClassification />
</div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;