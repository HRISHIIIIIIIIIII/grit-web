import { useState } from 'react';
import { useCreateHabit } from '@/api/hooks/habits';
import type { HabitCategory } from '@/api/types';
import { Button, Card, Input } from '@/components/primitives';
import { ALL_CATEGORIES, categoryIcon, categoryStyle } from '@/lib/categories';
import { cx } from '@/lib/cx';
import styles from './Habits.module.css';

export function AddHabitComposer({ onClose }: { onClose: () => void }) {
  const create = useCreateHabit();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<HabitCategory>('Fitness');
  const [xp, setXp] = useState(20);

  const submit = async () => {
    if (!name.trim()) return;
    await create.mutateAsync({ name: name.trim(), category, xp_value: xp, schedule: 'daily' });
    onClose();
  };

  return (
    <Card pad="md" style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Input
          label="Habit name"
          placeholder="e.g. Morning run · 5km"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <div>
          <div className={styles.fieldLabel}>Category</div>
          <div className={styles.catGrid}>
            {ALL_CATEGORIES.map((c) => {
              const cs = categoryStyle(c);
              const active = c === category;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={cx(styles.catChip, active && styles.catChipActive)}
                  style={active ? { color: cs.color, background: cs.bg, borderColor: cs.color } : undefined}
                >
                  {categoryIcon(c)} {c}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <div className={styles.fieldLabel}>XP value · {xp}</div>
          <input
            type="range"
            min={5}
            max={50}
            step={5}
            value={xp}
            onChange={(e) => setXp(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent)' }}
            aria-label="XP value"
          />
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={create.isPending || !name.trim()}>
            {create.isPending ? 'Adding…' : 'Add habit'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
