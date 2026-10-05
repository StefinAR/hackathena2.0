import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const classificationData = [
  {
    name: "Normal",
    value: 60,
    color: "#22c55e",
  },
  {
    name: "Suspicious",
    value: 20,
    color: "#f59e0b",
  },
  {
    name: "Malicious",
    value: 20,
    color: "#ef4444",
  },
];

function TrafficClassification() {
  return (
    <div className="classification-card">
      <div className="chart-header">
        <h2>Traffic Classification</h2>
        <p>Current traffic distribution</p>
      </div>

      <div className="classification-chart">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={classificationData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="45%"
              outerRadius={95}
              stroke="#0b1120"
              strokeWidth={2}
            >
              {classificationData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={entry.color}
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                color: "#f8fafc",
              }}
            />

            <Legend
              verticalAlign="bottom"
              height={40}
              iconType="circle"
              wrapperStyle={{
                color: "#94a3b8",
                fontSize: "13px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default TrafficClassification;