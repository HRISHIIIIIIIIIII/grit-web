import { useId } from 'react';

export interface AreaPoint {
  label: string;
  value: number;
}

export interface AreaChartProps {
  points: AreaPoint[];
  height?: number;
  color?: string;
}

/* Consistency trend — gradient area fill, 4 grid lines, last-point dot.
   Matches GRIT Analytics.dc.html (620×200 viewBox, stroke 2.6). */
export function AreaChart({ points, height = 200, color = 'var(--accent)' }: AreaChartProps) {
  const gradId = useId();
  const W = 620;
  const H = 200;
  const padX = 8;
  const padY = 18;

  if (points.length === 0) {
    return <div style={{ height, display: 'grid', placeItems: 'center', color: 'var(--ink-400)' }}>No data yet</div>;
  }

  const max = Math.max(1, ...points.map((p) => p.value));
  const min = 0;
  const span = max - min || 1;
  const stepX = (W - padX * 2) / Math.max(1, points.length - 1);

  const coords = points.map((p, i) => {
    const x = padX + i * stepX;
    const y = padY + (1 - (p.value - min) / span) * (H - padY * 2);
    return [x, y] as const;
  });

  const line = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const area = `${line} L${coords[coords.length - 1][0].toFixed(1)} ${H - padY} L${coords[0][0].toFixed(1)} ${H - padY} Z`;
  const last = coords[coords.length - 1];

  return (
    <div role="img" aria-label="Consistency trend">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={height} preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((g) => (
          <line
            key={g}
            x1={padX}
            x2={W - padX}
            y1={padY + g * (H - padY * 2)}
            y2={padY + g * (H - padY * 2)}
            stroke="#EEF0F1"
            strokeWidth={1}
          />
        ))}
        <path d={area} fill={`url(#${gradId})`} />
        <path d={line} fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={last[0]} cy={last[1]} r={5} fill={color} stroke="#fff" strokeWidth={2.5} />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        {points.map((p, i) => (
          <span
            key={i}
            className="mono"
            style={{ fontSize: 11, color: 'var(--ink-400)', fontWeight: 600 }}
          >
            {p.label}
          </span>
        ))}
      </div>
    </div>
  );
}
