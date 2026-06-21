export interface EvolutionStage {
  name: string;
  emoji: string;
  threshold: number;
  soft: string;
  border: string;
}

export const EVOLUTION_STAGES: EvolutionStage[] = [
  { name: 'Spark', emoji: '✨', threshold: 1, soft: '#FFF1E8', border: '#FFD9C2' },
  { name: 'Ember', emoji: '🔥', threshold: 7, soft: '#FFE9E2', border: '#FFC4B3' },
  { name: 'Flame', emoji: '🔆', threshold: 21, soft: '#FFE2D6', border: '#FFB59A' },
  { name: 'Blaze', emoji: '☀️', threshold: 46, soft: '#FFEFD2', border: '#FFD98A' },
  { name: 'Inferno', emoji: '☄️', threshold: 100, soft: '#F0F1F3', border: '#E5E7EA' },
  { name: 'Eternal', emoji: '👑', threshold: 365, soft: '#F0F1F3', border: '#E5E7EA' },
];

/* 6 evolution cells; reached stages are colored, future ones greyscaled.
   Matches GRIT Streaks.dc.html. */
export function EvolutionStages({ current }: { current: number }) {
  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
      {EVOLUTION_STAGES.map((s) => {
        const reached = current >= s.threshold;
        return (
          <div
            key={s.name}
            style={{
              flex: 1,
              aspectRatio: '1 / 1',
              borderRadius: 14,
              border: `1.5px solid ${reached ? s.border : 'var(--border)'}`,
              background: reached ? s.soft : '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              filter: reached ? 'none' : 'grayscale(1) opacity(0.5)',
            }}
            title={`${s.name} · ${s.threshold}+ days`}
          >
            <span style={{ fontSize: 28 }}>{s.emoji}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--ink-500)' }} className="mono">
              {s.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
