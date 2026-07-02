"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

type DataItem = { name: string; value: number; fill?: string };

export function MemorandumStatusChart({ data }: { data: DataItem[] }) {
  const filtered = data.filter((d) => d.value > 0);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={filtered}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
          nameKey="name"
        >
          {filtered.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill || "#10b981"} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [value, "Jumlah"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
