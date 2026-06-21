import { Icon } from '@/components/primitives';

export interface LevelRow {
  level: number;
  name: string;
  range: string;
  color: string;
}

export const LEVELS: LevelRow[] = [
  { level: 1, name: 'Beginner', range: '0–500 XP', color: 'var(--lvl-1)' },
  { level: 2, name: 'Consistent', range: '500–1.5k XP', color: 'var(--lvl-2)' },
  { level: 3, name: 'Focused', range: '1.5k–4k XP', color: 'var(--lvl-3)' },
  { level: 4, name: 'Disciplined', range: '4k–9k XP', color: 'var(--lvl-4)' },
  { level: 5, name: 'Relentless', range: '9k–18k XP', color: 'var(--lvl-5)' },
  { level: 6, name: 'Elite', range: '18k–35k XP', color: 'var(--lvl-6)' },
  { level: 7, name: 'Unstoppable', range: '35k+ XP', color: 'var(--lvl-7)' },
];

/* 7-row progression ladder — GRIT Profile.dc.html. */
export function LevelLadder({ currentLevel }: { currentLevel: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {LEVELS.map((l) => {
        const done = l.level < currentLevel;
        const active = l.level === currentLevel;
        return (
          <div
            key={l.level}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '12px 14px',
              borderRadius: 'var(--r-md)',
              border: `1px solid ${active ? l.color : 'var(--border)'}`,
              background: active ? '#F6F0FE' : '#fff',
              opacity: done || active ? 1 : 0.55,
            }}
          >
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                display: 'grid',
                placeItems: 'center',
                background: l.color,
                color: '#fff',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 15,
                flexShrink: 0,
              }}
            >
              {l.level}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontFamily: 'var(--font-display)', color: active ? l.color : 'var(--ink-900)' }}>
                {l.name}
              </div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--ink-400)', fontWeight: 600 }}>
                {l.range}
              </div>
            </div>
            {active && (
              <span
                className="mono"
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: l.color,
                  background: '#fff',
                  padding: '4px 9px',
                  borderRadius: 99,
                  border: `1px solid ${l.color}`,
                }}
              >
                YOU ARE HERE
              </span>
            )}
            {done && <Icon name="check" size={18} strokeWidth={2.4} style={{ color: 'var(--success)' }} />}
          </div>
        );
      })}
    </div>
  );
}
