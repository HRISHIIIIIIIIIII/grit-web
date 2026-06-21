import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import styles from './Avatar.module.css';

const GRADIENTS = [
  'linear-gradient(135deg,#0EA47F,#4F46E5)',
  'linear-gradient(135deg,#F5B301,#FF2D55)',
  'linear-gradient(135deg,#38BDF8,#6366F1)',
  'linear-gradient(135deg,#A855F7,#E03E52)',
  'linear-gradient(135deg,#0EA47F,#38BDF8)',
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function gradientFor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
}

export interface AvatarProps {
  name: string;
  size?: number;
  background?: string;
  className?: string;
  /** Optional photo (data URL or external URL). Falls back to initials when absent. */
  src?: string | null;
}

export function Avatar({ name, size = 38, background, className, src }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cx(styles.avatar, className)}
        style={{ width: size, height: size, objectFit: 'cover' }}
      />
    );
  }
  return (
    <span
      className={cx(styles.avatar, className)}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.36),
        background: background ?? gradientFor(name),
      }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}

export function AvatarStack({
  names,
  size = 32,
  max = 4,
}: {
  names: string[];
  size?: number;
  max?: number;
}) {
  const shown = names.slice(0, max);
  const extra = names.length - shown.length;
  return (
    <span className={styles.stack}>
      {shown.map((n, i) => (
        <Avatar key={i} name={n} size={size} />
      ))}
      {extra > 0 && (
        <Avatar name={`+${extra}`} size={size} background="var(--ink-900)" className={styles.more} />
      )}
    </span>
  );
}

export function More({ count, size = 32 }: { count: number; size?: number }): ReactNode {
  return <Avatar name={`+${count}`} size={size} background="var(--ink-900)" />;
}
