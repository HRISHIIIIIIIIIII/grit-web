import { cx } from '@/lib/cx';
import styles from './ProgressBar.module.css';

export interface ProgressBarProps {
  /** 0–100 */
  value: number;
  height?: number;
  /** Override the fill (e.g. a per-goal color or gradient). */
  color?: string;
  className?: string;
  'aria-label'?: string;
}

export function ProgressBar({ value, height = 9, color, className, ...aria }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cx(styles.track, className)}
      style={{ height }}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      {...aria}
    >
      <div className={styles.fill} style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}
