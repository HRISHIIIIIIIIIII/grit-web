import { useState } from 'react';
import {
  useArchiveHabit,
  useCheckin,
  useDeleteHabit,
  useHabits,
  useUndoCheckin,
} from '@/api/hooks/habits';
import type { HabitRead } from '@/api/types';
import { Button, Card, Icon, Skeleton, Tooltip } from '@/components/primitives';
import { HabitRow } from '@/components/HabitRow';
import { PageHeader } from '@/components/PageHeader';
import { AddHabitComposer } from './AddHabitComposer';
import styles from './Habits.module.css';

export function HabitsPage() {
  const all = useHabits(true);
  const checkin = useCheckin();
  const undo = useUndoCheckin();
  const archive = useArchiveHabit();
  const del = useDeleteHabit();
  const [composing, setComposing] = useState(false);

  const habits = all.data ?? [];
  const active = habits.filter((h) => !h.archived);
  const archived = habits.filter((h) => h.archived);

  const onToggle = (h: HabitRead) => {
    if (h.checked_in_today) undo.mutate(h.id);
    else checkin.mutate(h.id);
  };

  return (
    <div>
      <PageHeader
        title="Habits"
        subtitle="YOUR DAILY SYSTEM"
        actions={
          <Button onClick={() => setComposing((v) => !v)}>
            <Icon name="add" size={18} /> Add habit
          </Button>
        }
      />

      {composing && <AddHabitComposer onClose={() => setComposing(false)} />}

      {all.isLoading ? (
        <Skeleton height={200} />
      ) : active.length === 0 && !composing ? (
        <Card>
          <div className={styles.empty}>
            <p style={{ fontWeight: 600, marginBottom: 6 }}>No habits yet</p>
            <p style={{ marginBottom: 16 }}>Build your system one habit at a time.</p>
            <Button onClick={() => setComposing(true)}>
              <Icon name="add" size={18} /> Add your first habit
            </Button>
          </div>
        </Card>
      ) : (
        <Card pad="none">
          {active.map((h) => (
            <HabitRow
              key={h.id}
              habit={h}
              onToggle={onToggle}
              trailing={
                <Tooltip label="Archive">
                  <button
                    className={styles.iconBtn}
                    onClick={() => archive.mutate({ id: h.id, archived: true })}
                    aria-label={`Archive ${h.name}`}
                  >
                    <Icon name="archive" size={17} />
                  </button>
                </Tooltip>
              }
            />
          ))}
        </Card>
      )}

      {archived.length > 0 && (
        <>
          <div className={styles.sectionTitle}>Archived · {archived.length}</div>
          <Card pad="none">
            {archived.map((h) => (
              <HabitRow
                key={h.id}
                habit={h}
                trailing={
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => archive.mutate({ id: h.id, archived: false })}
                    >
                      Restore
                    </Button>
                    <Tooltip label="Delete forever">
                      <button
                        className={styles.iconBtn}
                        onClick={() => del.mutate(h.id)}
                        aria-label={`Delete ${h.name}`}
                      >
                        <Icon name="trash" size={17} />
                      </button>
                    </Tooltip>
                  </div>
                }
              />
            ))}
          </Card>
        </>
      )}
    </div>
  );
}
