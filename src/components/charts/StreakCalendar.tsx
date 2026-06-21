export type DayState = 'done' | 'freeze' | 'missed' | 'today' | 'future';

export interface CalendarDay {
  label?: string | number;
  state: DayState;
}

const STYLES: Record<DayState, { bg: string; border: string; color: string }> = {
  done: { bg: 'var(--accent)', border: 'var(--accent)', color: '#fff' },
  freeze: { bg: '#E8F0FE', border: '#BBD3FB', color: '#2563EB' },
  missed: { bg: '#FCE7E9', border: '#F6C9CE', color: '#DC2626' },
  today: { bg: 'var(--ink-900)', border: 'var(--ink-900)', color: '#fff' },
  future: { bg: 'var(--page)', border: '#EEF0F1', color: 'var(--ink-400)' },
};

const GLYPH: Record<DayState, string> = {
  done: '✓',
  freeze: '❄',
  missed: '·',
  today: '',
  future: '',
};

/* 35-day streak calendar grid (7 cols) — GRIT Streaks.dc.html. */
export function StreakCalendar({ days }: { days: CalendarDay[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
        <div
          key={i}
          className="mono"
          style={{ textAlign: 'center', fontSize: 10, fontWeight: 600, color: 'var(--ink-400)' }}
        >
          {d}
        </div>
      ))}
      {days.map((day, i) => {
        const s = STYLES[day.state];
        return (
          <div
            key={i}
            style={{
              aspectRatio: '1 / 1',
              borderRadius: 9,
              background: s.bg,
              border: `1.5px solid ${s.border}`,
              color: s.color,
              display: 'grid',
              placeItems: 'center',
              fontSize: 13,
              fontWeight: 600,
            }}
            className="tabular"
          >
            {day.label ?? GLYPH[day.state]}
          </div>
        );
      })}
    </div>
  );
}
