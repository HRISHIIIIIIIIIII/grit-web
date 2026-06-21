export interface TimeBucket {
  label: string;
  count: number;
}

/* Time-of-day bars — best slot solid accent, others 30% — GRIT Analytics.dc.html. */
export function TimeOfDayBars({ buckets, height = 150 }: { buckets: TimeBucket[]; height?: number }) {
  const max = Math.max(1, ...buckets.map((b) => b.count));
  const best = Math.max(...buckets.map((b) => b.count));
  return (
    <div style={{ display: 'flex', gap: 14, height, alignItems: 'flex-end' }}>
      {buckets.map((b) => {
        const pct = Math.max(b.count > 0 ? 4 : 0, (b.count / max) * 100);
        const isBest = b.count === best && best > 0;
        return (
          <div key={b.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
              <div
                style={{
                  width: '100%',
                  height: `${pct}%`,
                  borderRadius: '6px 6px 4px 4px',
                  background: isBest ? 'var(--accent)' : 'rgba(var(--accent-rgb), 0.3)',
                  transition: 'height 0.45s var(--ease-spring)',
                }}
              />
            </div>
            <span className="mono" style={{ fontSize: 10, fontWeight: 600, color: 'var(--ink-400)' }}>
              {b.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
