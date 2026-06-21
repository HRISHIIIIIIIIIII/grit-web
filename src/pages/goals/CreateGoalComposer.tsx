import { useState } from 'react';
import { useCreateGoal } from '@/api/hooks/goals';
import { Button, Card, Icon, Input } from '@/components/primitives';
import styles from './Goals.module.css';

const ICONS = ['🎯', '🏃', '📚', '🚀', '🧘', '💪', '💰', '🎨', '🧠'];

export function CreateGoalComposer({ onClose }: { onClose: () => void }) {
  const create = useCreateGoal();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🎯');
  const [deadline, setDeadline] = useState('');
  const [milestones, setMilestones] = useState<string[]>(['']);

  const submit = async () => {
    if (!name.trim()) return;
    await create.mutateAsync({
      name: name.trim(),
      icon,
      deadline: deadline || null,
      habit_ids: [],
      milestones: milestones
        .map((m) => m.trim())
        .filter(Boolean)
        .map((m, i) => ({ name: m, order_index: i })),
    });
    onClose();
  };

  return (
    <Card pad="md" style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Input
          label="Goal name"
          placeholder="e.g. Run a half marathon"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink-700)', marginBottom: 9 }}>
            Icon
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {ICONS.map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIcon(i)}
                style={{
                  width: 40,
                  height: 40,
                  fontSize: 20,
                  borderRadius: 10,
                  border: `1.5px solid ${i === icon ? 'var(--accent)' : 'var(--border)'}`,
                  background: i === icon ? 'var(--accent-soft)' : '#fff',
                  cursor: 'pointer',
                }}
              >
                {i}
              </button>
            ))}
          </div>
        </div>
        <Input
          id="deadline"
          label="Deadline (optional)"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink-700)', marginBottom: 9 }}>
            Milestones
          </div>
          {milestones.map((m, i) => (
            <div key={i} className={styles.composerRow}>
              <Input
                placeholder={`Milestone ${i + 1}`}
                value={m}
                onChange={(e) =>
                  setMilestones((ms) => ms.map((x, j) => (j === i ? e.target.value : x)))
                }
              />
              {milestones.length > 1 && (
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => setMilestones((ms) => ms.filter((_, j) => j !== i))}
                  aria-label="Remove milestone"
                >
                  <Icon name="close" size={16} />
                </button>
              )}
            </div>
          ))}
          <Button variant="ghost" size="sm" onClick={() => setMilestones((ms) => [...ms, ''])}>
            <Icon name="add" size={16} /> Add milestone
          </Button>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={create.isPending || !name.trim()}>
            {create.isPending ? 'Creating…' : 'Create goal'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
