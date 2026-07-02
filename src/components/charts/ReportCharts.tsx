"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type DataItem = { bulan: string; memorandum: number; rapat: number; sla: number };

export function ReportTrendChart({ data }: { data: DataItem[] }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="bulan" tick={{ fontSize: 12, fill: "#64748b" }} />
        <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
        <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
        <Legend />
        <Bar dataKey="memorandum" name="Memorandum" fill="#059669" radius={[4, 4, 0, 0]} />
        <Bar dataKey="rapat" name="Rapat" fill="#2563eb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DivisiChart({ data }: { data: { divisi: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 20, left: 10, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis type="number" tick={{ fontSize: 12, fill: "#64748b" }} />
        <YAxis
          type="category"
          dataKey="divisi"
          width={140}
          tick={{ fontSize: 11, fill: "#64748b" }}
        />
        <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
        <Bar dataKey="count" name="Memorandum" fill="#059669" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SentimentChart({ data }: { data: { sentiment: string; count: number }[] }) {
  const colors: Record<string, string> = {
    Positif: "#10b981",
    Netral: "#64748b",
    Negatif: "#ef4444",
  };

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="sentiment" tick={{ fontSize: 12, fill: "#64748b" }} />
        <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
        <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
        <Bar
          dataKey="count"
          name="Artikel"
          radius={[4, 4, 0, 0]}
          fill="#059669"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          shape={(props: any) => {
            const { x, y, width, height, payload } = props;
            return (
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={colors[payload.sentiment] || "#059669"}
                rx={4}
              />
            );
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
