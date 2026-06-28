"use client";

/**
 * Smooth pacing curve, Aperture-style:
 *   - filled gradient under a 1.6px white-on-near-black spline
 *   - colored dots at each day, ringed with the page surface
 *   - day-number labels under each point
 *
 * SVG is drawn at 300×120 user-units and scaled to its container,
 * so it looks crisp at any width.
 */

type CurveDatum = {
  dayId: string;
  dayNumber: number;
  score: number;
  color: string;
};

const W = 300;
const H = 120;

const round = (n: number) => Math.round(n * 10) / 10;

export function CadenceCurve({ data }: { data: CurveDatum[] }) {
  if (!data.length) return null;

  const n = data.length;
  const slot = W / n;
  const pts = data.map((d, i) => {
    const cx = slot * (i + 0.5);
    const y = H - (d.score / 10) * H;
    return { ...d, cx: round(cx), y: round(y) };
  });

  // Cubic spline through the points: control points sit halfway between
  // each pair on the same y as their respective endpoint. Gives a calm
  // editorial wave without overshoot.
  let line = `M ${pts[0].cx} ${pts[0].y}`;
  for (let i = 1; i < n; i++) {
    const p0 = pts[i - 1];
    const p1 = pts[i];
    const mx = round((p0.cx + p1.cx) / 2);
    line += ` C ${mx} ${p0.y} ${mx} ${p1.y} ${p1.cx} ${p1.y}`;
  }
  const area = `${line} L ${pts[n - 1].cx} ${H} L ${pts[0].cx} ${H} Z`;

  return (
    <>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          marginTop: 10,
          overflow: "visible",
        }}
      >
        <defs>
          <linearGradient id="cdGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f4f0ea" stopOpacity="0.18" />
            <stop offset="1" stopColor="#f4f0ea" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#cdGrad)" />
        <path
          d={line}
          fill="none"
          stroke="#ece9e3"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {pts.map((p) => (
          <circle
            key={p.dayId}
            cx={p.cx}
            cy={p.y}
            r={3.4}
            fill={p.color}
            stroke="var(--color-surface)"
            strokeWidth={1.6}
          />
        ))}
      </svg>
      <div style={{ display: "flex", marginTop: 3, padding: "0 2px" }}>
        {pts.map((p) => (
          <span
            key={p.dayId}
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: 10,
              color: "var(--color-text-faint)",
            }}
          >
            {p.dayNumber}
          </span>
        ))}
      </div>
    </>
  );
}
