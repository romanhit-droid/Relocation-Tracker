"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Row = { phase: string; pct: number; done: number; total: number };

export function PhaseChart({ data }: { data: Row[] }) {
  const top = data.slice(0, 12);
  if (top.length === 0) {
    return (
      <p className="text-sm text-slate-500">No tasks yet. Run the seed script.</p>
    );
  }

  return (
    <div className="h-[420px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={top}
          margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
        >
          <XAxis type="number" domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="phase"
            width={200}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            tickFormatter={(v: string) =>
              v.length > 36 ? `${v.slice(0, 34)}…` : v
            }
          />
          <Tooltip
            contentStyle={{
              background: "#1a2332",
              border: "1px solid #2d3a4d",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#e2e8f0" }}
            formatter={(value, _name, item) => {
              const raw = Array.isArray(value) ? value[0] : value;
              const pct = Number(raw);
              const safePct = Number.isFinite(pct) ? pct : 0;
              const payload = item?.payload as Row | undefined;
              const done = payload?.done ?? 0;
              const total = payload?.total ?? 0;
              return [`${safePct}% (${done}/${total})`, "Done"];
            }}
          />
          <Bar dataKey="pct" fill="#3b82f6" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
