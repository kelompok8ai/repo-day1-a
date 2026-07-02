"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type DataItem = { month: string; compliance: number };

export function SlaTrendChart({ data }: { data: DataItem[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} />
        <YAxis domain={[80, 100]} tick={{ fontSize: 12, fill: "#64748b" }} unit="%" />
        <Tooltip
          formatter={(value) => [`${value}%`, "SLA Compliance"]}
          contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }}
        />
        <Line
          type="monotone"
          dataKey="compliance"
          stroke="#2563eb"
          strokeWidth={2}
          dot={{ fill: "#2563eb", r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
