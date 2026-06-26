"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";

type CurveDatum = {
  dayId: string;
  dayNumber: number;
  score: number;
  label: string;
};

// Placing outside the component so it doesn't get recreated every render
// Simple pure function. Same input = same output
function colorForScore(score: number): string {
  if (score >= 8) return "#dc2626";
  if (score >= 6) return "#f59e0b";
  if (score >= 3) return "#10b981";
  return "#94a3b8";
}

export function CadenceCurve({ data }: { data: CurveDatum[] }) {
  return (
    <div className="w-full h-32">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <XAxis
            dataKey="dayNumber"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "#9ca3af" }}
          />
          <YAxis
            domain={[0, 10]}
            ticks={[0, 5, 10]}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            width={24}
          />
          <Bar dataKey="score" radius={[4, 4, 0, 0]}>
            {data.map((d) => (
              <Cell key={d.dayId} fill={colorForScore(d.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
