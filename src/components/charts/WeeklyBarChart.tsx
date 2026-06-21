export interface WeeklyBar {
  label: string;
  value: number;
  /** Render this bar as "today" (solid ink). */
  today?: boolean;
}

export interface WeeklyBarChartProps {
  bars: WeeklyBar[];
  height?: number;
  /** Denominator for bar height; defaults to max(values, 1). */
  max?: number;
}

/* Weekly bars — height = value/max, today bar is solid ink, mono count above.
   Matches GRIT Dashboard.dc.html. */
export function WeeklyBarChart({ bars, height = 150, max }: WeeklyBarChartProps) {
  const denom = max ?? Math.max(1, ...bars.map((b) => b.value));
  return (
    <div style={{ display: 'flex', gap: 12, height, alignItems: 'flex-end' }}>
      {bars.map((b) => {
        const pct = Math.max(b.value > 0 ? 3 : 0, (b.value / denom) * 100);
        const fill = b.today
          ? 'var(--ink-900)'
          : `rgba(var(--accent-rgb), ${0.4 + 0.6 * (b.value / denom)})`;
        return (
          <div
            key={b.label}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
          >
            <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', position: 'relative' }}>
              <div
                style={{
                  width: '100%',
                  height: `${pct}%`,
                  background: fill,
                  borderRadius: '6px 6px 4px 4px',
                  transition: 'height 0.45s var(--ease-spring)',
                  position: 'relative',
                }}
              >
                <span
                  className="mono tabular"
                  style={{
                    position: 'absolute',
                    top: -19,
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--ink-500)',
                  }}
                >
                  {b.value}
                </span>
              </div>
            </div>
            <span
              className="mono"
              style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-400)', letterSpacing: '0.06em' }}
            >
              {b.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
