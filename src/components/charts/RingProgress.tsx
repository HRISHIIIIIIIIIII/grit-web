import type { ReactNode } from 'react';

export interface RingProgressProps {
  /** 0–100 */
  value: number;
  size?: number;
  strokeWidth?: number;
  trackColor?: string;
  color?: string;
  children?: ReactNode;
  /** Accessible label for the ring. */
  label?: string;
}

/* Daily ring — matches GRIT Dashboard.dc.html (size 104, sw 12, r 46),
   reused on Roadmaps (size 92, sw 11). Spring dashoffset fill. */
export function RingProgress({
  value,
  size = 104,
  strokeWidth = 12,
  trackColor = '#EEF0F1',
  color = 'var(--accent)',
  children,
  label,
}: RingProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, value));
  const offset = circumference * (1 - pct / 100);
  const center = size / 2;

  return (
    <div
      style={{ position: 'relative', width: size, height: size }}
      role="img"
      aria-label={label ?? `${Math.round(pct)} percent`}
    >
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={center} cy={center} r={radius} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.5s var(--ease-spring)' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
}
