import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGoal, useDeleteGoal, useToggleMilestone } from '@/api/hooks/goals';
import { useHabits } from '@/api/hooks/habits';
import { RingProgress } from '@/components/charts';
import { Badge, Button, Card, Checkbox, Icon, ProgressBar, Skeleton } from '@/components/primitives';
import { cx } from '@/lib/cx';
import { categoryIcon } from '@/lib/categories';
import styles from './Goals.module.css';

function daysLeft(deadline: string | null): number | null {
  if (!deadline) return null;
  const ms = new Date(deadline).getTime() - Date.now();
  return Math.ceil(ms / 86_400_000);
}

export function GoalDetailPage() {
  const { id } = useParams();
  const goalId = Number(id);
  const goal = useGoal(goalId);
  const habits = useHabits(true);
  const toggle = useToggleMilestone(goalId);
  const del = useDeleteGoal();
  const navigate = useNavigate();

  if (goal.isLoading) return <Skeleton height={300} />;
  if (goal.isError || !goal.data)
    return (
      <Card>
        <p style={{ padding: 24 }}>Goal not found.</p>
      </Card>
    );

  const g = goal.data;
  const left = daysLeft(g.deadline);
  const linked = (habits.data ?? []).filter((h) => g.habit_ids.includes(h.id));

  return (
    <div>
      <Link
        to="/goals"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--ink-500)', fontWeight: 600, fontSize: 14, marginBottom: 16 }}
      >
        <Icon name="arrowLeft" size={18} /> Goals
      </Link>

      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <span
            className={styles.gcIcon}
            style={{ width: 64, height: 64, fontSize: 30, background: g.color ? `${g.color}1a` : 'var(--surface)' }}
          >
            {g.icon ?? '🎯'}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ fontSize: 26 }}>{g.name}</h1>
              <Badge tone={g.status === 'completed' ? 'completed' : 'active'}>{g.status}</Badge>
            </div>
            <p className="mono" style={{ color: 'var(--ink-500)', marginTop: 6 }}>
              {g.done_milestones}/{g.total_milestones} milestones done
            </p>
          </div>
          <RingProgress value={g.progress_pct} size={92} strokeWidth={10}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20 }} className="tabular">
              {g.progress_pct}%
            </div>
          </RingProgress>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16, alignItems: 'start' }}>
        <Card pad="none">
          <div style={{ padding: '18px 22px 4px', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17 }}>
            Milestones
          </div>
          <div style={{ padding: '0 22px 12px' }}>
            {g.milestones.length === 0 ? (
              <p style={{ padding: '14px 0', color: 'var(--ink-500)' }}>No milestones.</p>
            ) : (
              g.milestones.map((m) => (
                <div key={m.id} className={cx(styles.milestone, m.done && styles.mDone)}>
                  <Checkbox
                    checked={m.done}
                    onChange={(done) => toggle.mutate({ milestoneId: m.id, done })}
                    label={m.name}
                  />
                  <span className={styles.mName}>{m.name}</span>
                  {m.due_label && <span className={styles.mDue}>{m.due_label}</span>}
                </div>
              ))
            )}
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, marginBottom: 14 }}>
              Pace
            </div>
            <div className={styles.pace}>
              <div className={styles.paceItem}>
                <div className={styles.paceNum}>{g.progress_pct}%</div>
                <div className={styles.paceLabel}>Complete</div>
              </div>
              <div className={styles.paceItem}>
                <div className={styles.paceNum}>
                  {left === null ? '—' : left < 0 ? 'Past' : left}
                </div>
                <div className={styles.paceLabel}>{left === null ? 'No deadline' : 'Days left'}</div>
              </div>
            </div>
            <div style={{ marginTop: 14 }}>
              <ProgressBar value={g.progress_pct} color={g.color ?? undefined} />
            </div>
          </Card>

          <Card>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, marginBottom: 14 }}>
              Linked habits
            </div>
            {linked.length === 0 ? (
              <p style={{ color: 'var(--ink-500)', fontSize: 14 }}>No habits linked.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {linked.map((h) => (
                  <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{h.icon ?? categoryIcon(h.category)}</span>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{h.name}</span>
                    {h.checked_in_today && <Icon name="check" size={16} className={styles.mDone} style={{ color: 'var(--success)' }} />}
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Button
            variant="danger"
            onClick={() => {
              del.mutate(goalId);
              navigate('/goals');
            }}
          >
            <Icon name="trash" size={17} /> Delete goal
          </Button>
        </div>
      </div>
    </div>
  );
}
