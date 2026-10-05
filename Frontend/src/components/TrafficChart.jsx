import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const trafficData = [
  { time: "10:00", traffic: 12 },
  { time: "10:05", traffic: 18 },
  { time: "10:10", traffic: 15 },
  { time: "10:15", traffic: 24 },
  { time: "10:20", traffic: 21 },
  { time: "10:25", traffic: 29 },
  { time: "10:30", traffic: 25 },
];

function TrafficChart() {
  return (
    <div className="traffic-card">
      <div className="chart-header">
        <h2>Network Traffic</h2>
        <p>Traffic volume over the last 30 minutes</p>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={trafficData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid
              stroke="#1e293b"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="time"
              stroke="#64748b"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={{ stroke: "#334155" }}
              tickLine={false}
            />

            <YAxis
              stroke="#64748b"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={{ stroke: "#334155" }}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                color: "#f8fafc",
              }}
              labelStyle={{
                color: "#94a3b8",
              }}
            />

            <Line
              type="monotone"
              dataKey="traffic"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 5,
                fill: "#3b82f6",
                stroke: "#0b1120",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default TrafficChart;