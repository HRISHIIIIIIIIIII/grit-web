import { ProgressBar } from '@/components/primitives';

export interface VelocityRow {
  title: string;
  value: number;
  icon?: string;
}

/* Roadmap velocity — icon + name + horizontal bar — GRIT Analytics.dc.html. */
export function VelocityBars({ rows }: { rows: VelocityRow[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  if (rows.length === 0) {
    return <div style={{ color: 'var(--ink-400)', fontSize: 14, padding: '8px 0' }}>No topics completed yet.</div>;
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {rows.map((r) => (
        <div key={r.title} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {r.icon && <span style={{ fontSize: 18 }}>{r.icon}</span>}
          <span style={{ flex: '0 0 130px', fontSize: 13, fontWeight: 600, color: 'var(--ink-700)' }}>{r.title}</span>
          <div style={{ flex: 1 }}>
            <ProgressBar value={(r.value / max) * 100} aria-label={`${r.title} velocity`} />
          </div>
          <span className="mono tabular" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-500)', width: 28, textAlign: 'right' }}>
            {r.value}
          </span>
        </div>
      ))}
    </div>
  );
}
