export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

export interface DonutProps {
  segments: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string | number;
}

/* Category donut — matches GRIT Analytics.dc.html (132px, stroke 20, center total). */
export function Donut({
  segments,
  size = 132,
  strokeWidth = 20,
  centerLabel = 'check-ins',
  centerValue,
}: DonutProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((s, x) => s + x.value, 0);
  const center = size / 2;

  let offsetAcc = 0;
  const arcs = segments.map((seg) => {
    const frac = total > 0 ? seg.value / total : 0;
    const dash = frac * circumference;
    const arc = {
      ...seg,
      dasharray: `${dash} ${circumference - dash}`,
      dashoffset: -offsetAcc,
    };
    offsetAcc += dash;
    return arc;
  });

  return (
    <div style={{ position: 'relative', width: size, height: size }} role="img" aria-label="Category breakdown">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={center} cy={center} r={radius} fill="none" stroke="#EEF0F1" strokeWidth={strokeWidth} />
        {arcs.map((a) => (
          <circle
            key={a.label}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={a.color}
            strokeWidth={strokeWidth}
            strokeDasharray={a.dasharray}
            strokeDashoffset={a.dashoffset}
          />
        ))}
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
          lineHeight: 1.1,
        }}
      >
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24 }} className="tabular">
            {centerValue ?? total}
          </div>
          <div style={{ fontSize: 11, color: 'var(--ink-400)', fontWeight: 600 }}>{centerLabel}</div>
        </div>
      </div>
    </div>
  );
}
