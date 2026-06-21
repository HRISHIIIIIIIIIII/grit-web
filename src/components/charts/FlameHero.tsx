export interface FlameHeroProps {
  size?: number;
  emoji?: string;
}

/* 140px flame with gritFlame pulse — GRIT Streaks.dc.html hero. */
export function FlameHero({ size = 140, emoji = '🔥' }: FlameHeroProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: 36,
        display: 'grid',
        placeItems: 'center',
        fontSize: size * 0.53,
        background: 'linear-gradient(135deg, var(--fire-a), var(--fire-b))',
        boxShadow: '0 14px 40px rgba(255,45,85,.4)',
        animation: 'gritFlame 2.6s ease-in-out infinite',
      }}
    >
      {emoji}
    </div>
  );
}
