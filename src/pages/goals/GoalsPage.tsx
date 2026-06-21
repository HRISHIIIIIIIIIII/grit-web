import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGoals } from '@/api/hooks/goals';
import { Badge, Button, Card, Icon, ProgressBar, Skeleton } from '@/components/primitives';
import { PageHeader } from '@/components/PageHeader';
import { CreateGoalComposer } from './CreateGoalComposer';
import styles from './Goals.module.css';

const STATUS_TONE = { active: 'active', completed: 'completed', archived: 'paused' } as const;

export function GoalsPage() {
  const goals = useGoals();
  const [composing, setComposing] = useState(false);

  return (
    <div>
      <PageHeader
        title="Goals"
        subtitle="WHAT YOU'RE BUILDING TOWARD"
        actions={
          <Button onClick={() => setComposing((v) => !v)}>
            <Icon name="add" size={18} /> New goal
          </Button>
        }
      />

      {composing && <CreateGoalComposer onClose={() => setComposing(false)} />}

      {goals.isLoading ? (
        <div className={styles.grid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height={150} radius={16} />
          ))}
        </div>
      ) : (goals.data ?? []).length === 0 && !composing ? (
        <Card>
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--ink-500)' }}>
            <p style={{ fontWeight: 600, marginBottom: 6 }}>No goals yet</p>
            <p style={{ marginBottom: 16 }}>Set a goal and break it into milestones.</p>
            <Button onClick={() => setComposing(true)}>Create your first goal</Button>
          </div>
        </Card>
      ) : (
        <div className={styles.grid}>
          {goals.data!.map((g) => (
            <Card key={g.id} interactive style={{ padding: 0 }}>
              <Link to={`/goals/${g.id}`} style={{ display: 'block', padding: 20, height: '100%' }}>
                <div className={styles.goalCard}>
                  <div className={styles.gcTop}>
                    <span
                      className={styles.gcIcon}
                      style={{ background: g.color ? `${g.color}1a` : 'var(--surface)' }}
                    >
                      {g.icon ?? '🎯'}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div className={styles.gcName}>{g.name}</div>
                      <div className={styles.gcMeta}>
                        {g.done_milestones}/{g.total_milestones} milestones
                      </div>
                    </div>
                    <Badge tone={STATUS_TONE[g.status]}>{g.status}</Badge>
                  </div>
                  <ProgressBar value={g.progress_pct} color={g.color ?? undefined} />
                  <div className={styles.gcFoot}>
                    <span style={{ fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: 16 }}>
                      {g.progress_pct}%
                    </span>
                    {g.deadline && <span className="mono">due {g.deadline}</span>}
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
