export interface TrackMilestone {
  label: string;
  at: number;
}

export interface MilestoneTrackProps {
  current: number;
  milestones: TrackMilestone[];
}

/* Horizontal milestone track with dots — GRIT Streaks.dc.html. */
export function MilestoneTrack({ current, milestones }: MilestoneTrackProps) {
  const maxAt = Math.max(...milestones.map((m) => m.at), 1);
  const pct = Math.min(100, (current / maxAt) * 100);

  return (
    <div style={{ paddingTop: 28, paddingBottom: 24 }}>
      <div style={{ position: 'relative', height: 3, background: '#EEF0F1', borderRadius: 99 }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: `${pct}%`,
            background: 'var(--accent)',
            borderRadius: 99,
            transition: 'width 0.45s var(--ease-spring)',
          }}
        />
        {milestones.map((m) => {
          const left = (m.at / maxAt) * 100;
          const reached = current >= m.at;
          return (
            <div
              key={m.at}
              style={{
                position: 'absolute',
                left: `${left}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 99,
                  border: `2.5px solid ${reached ? 'var(--accent)' : '#E5E7EA'}`,
                  background: '#fff',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 13,
                  fontWeight: 700,
                  color: reached ? 'var(--accent-strong)' : 'var(--ink-400)',
                  filter: reached ? 'none' : 'grayscale(0.5) opacity(0.6)',
                }}
                className="tabular"
              >
                {m.at}
              </div>
              <span
                style={{
                  position: 'absolute',
                  top: 52,
                  whiteSpace: 'nowrap',
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--ink-500)',
                }}
              >
                {m.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
