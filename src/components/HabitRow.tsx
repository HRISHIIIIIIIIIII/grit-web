import type { HabitRead } from '@/api/types';
import { Checkbox, Icon } from '@/components/primitives';
import { categoryIcon, categoryStyle } from '@/lib/categories';
import { cx } from '@/lib/cx';
import styles from './HabitRow.module.css';

export interface HabitRowProps {
  habit: HabitRead;
  onToggle?: (habit: HabitRead) => void;
  trailing?: React.ReactNode;
}

export function HabitRow({ habit, onToggle, trailing }: HabitRowProps) {
  const cat = categoryStyle(habit.category);
  const done = habit.checked_in_today;
  return (
    <div className={cx(styles.row, done && styles.done)}>
      <span className={styles.icon} style={{ background: cat.bg }}>
        {habit.icon ?? categoryIcon(habit.category)}
      </span>
      <div className={styles.meta}>
        <div className={styles.name}>{habit.name}</div>
        <div className={styles.sub}>
          <span className={styles.cat} style={{ color: cat.color, background: cat.bg }}>
            {habit.category}
          </span>
          {habit.current_streak > 0 && (
            <span className={styles.streak}>🔥 {habit.current_streak}d</span>
          )}
          {habit.linked_roadmap_id != null && <span className={styles.linkTag}>ROADMAP</span>}
        </div>
      </div>
      <span className={styles.xp}>+{habit.xp_value} XP</span>
      {trailing}
      {onToggle && (
        <Checkbox
          checked={done}
          onChange={() => onToggle(habit)}
          label={done ? `Uncheck ${habit.name}` : `Check in ${habit.name}`}
        />
      )}
    </div>
  );
}

export function HabitRowSkeleton() {
  return (
    <div className={styles.row}>
      <span className={styles.icon} style={{ background: 'var(--surface)' }}>
        <Icon name="habit" size={18} style={{ color: 'var(--ink-300)' }} />
      </span>
      <div className={styles.meta}>
        <div style={{ width: 140, height: 14, background: 'var(--surface)', borderRadius: 6 }} />
        <div style={{ width: 80, height: 10, background: 'var(--surface)', borderRadius: 6, marginTop: 8 }} />
      </div>
    </div>
  );
}
