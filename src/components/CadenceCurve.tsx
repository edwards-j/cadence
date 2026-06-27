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
  color: string;
};

export function CadenceCurve({ data }: { data: CurveDatum[] }) {
  return (
    <div className="w-full h-32">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <XAxis
            dataKey="dayNumber"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "var(--color-muted)" }}
          />
          <YAxis
            domain={[0, 10]}
            ticks={[0, 5, 10]}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "var(--color-muted)" }}
            width={24}
          />
          <Bar dataKey="score" radius={[4, 4, 0, 0]}>
            {data.map((d) => (
              <Cell key={d.dayId} fill={d.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
