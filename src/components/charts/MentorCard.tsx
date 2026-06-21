import { cx } from '@/lib/cx';
import styles from './MentorCard.module.css';

export interface MentorCardProps {
  message: string;
  title?: string;
  compact?: boolean;
  className?: string;
}

/* ATLAS mentor card — dark surface + radial accent glow. */
export function MentorCard({ message, title = 'ATLAS', compact = false, className }: MentorCardProps) {
  return (
    <div className={cx(styles.card, compact && styles.compact, className)}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.head}>
        <span className={styles.logo} aria-hidden="true">
          A
        </span>
        <span className={styles.name}>{title}</span>
      </div>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
