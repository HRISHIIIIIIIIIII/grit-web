import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMe } from '@/api/hooks/auth';
import { useCheckin, useHabits, useUndoCheckin } from '@/api/hooks/habits';
import { useGoals } from '@/api/hooks/goals';
import { useAnalytics, useHeatmap, useStreak } from '@/api/hooks/progress';
import { useAchievements, useSettings } from '@/api/hooks/misc';
import { getCoach } from '@/lib/coaches';
import type { HabitRead } from '@/api/types';
import {
  ContributionHeatmap,
  MentorCard,
  RingProgress,
  WeeklyBarChart,
} from '@/components/charts';
import { Badge, Button, Card, ProgressBar, SegmentedControl, Skeleton } from '@/components/primitives';
import { HabitRow, HabitRowSkeleton } from '@/components/HabitRow';
import { coachDashboardMessage, greeting } from './atlas';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const me = useMe();
  const habits = useHabits();
  const streak = useStreak();
  const goals = useGoals();
  const analytics = useAnalytics('week');
  const achievements = useAchievements();
  const settings = useSettings();
  const coach = getCoach(settings.data?.coach);
  const [range, setRange] = useState<'weeks' | 'year'>('weeks');
  const heatmap = useHeatmap(range);
  const checkin = useCheckin();
  const undo = useUndoCheckin();

  const list = habits.data ?? [];
  const done = list.filter((h) => h.checked_in_today).length;
  const total = list.length;
  const ringPct = total ? Math.round((done / total) * 100) : 0;
  const todayXp = list.filter((h) => h.checked_in_today).reduce((s, h) => s + h.xp_value, 0);

  const onToggle = (h: HabitRead) => {
    if (h.checked_in_today) undo.mutate(h.id);
    else checkin.mutate(h.id);
  };

  const weeklyBars = (analytics.data?.trend ?? []).map((p, i, arr) => ({
    label: p.label,
    value: p.value,
    today: i === arr.length - 1,
  }));

  const topGoals = (goals.data ?? []).filter((g) => g.status !== 'archived').slice(0, 4);
  const recentBadges = (achievements.data ?? []).filter((a) => a.unlocked).slice(0, 6);

  return (
    <div>
      <div className={styles.greeting}>
        <h1>{me.data ? greeting(me.data.display_name) : 'Welcome back'}</h1>
        <p className={styles.greetingSub}>
          {done} of {total} habits done today · {todayXp} XP earned · {streak.data?.current_daily ?? 0}-day streak
        </p>
      </div>

      <div className={styles.grid}>
        <Card pad="none">
          <div style={{ padding: '18px 18px 6px' }} className={styles.cardHead}>
            <span className={styles.cardTitle}>Today&apos;s habits</span>
            <Link to="/habits">
              <Button variant="ghost" size="sm">
                Manage
              </Button>
            </Link>
          </div>
          {habits.isLoading
            ? Array.from({ length: 5 }).map((_, i) => <HabitRowSkeleton key={i} />)
            : list.length === 0
              ? <div style={{ padding: 24, color: 'var(--ink-500)' }}>
                  No habits yet. <Link to="/habits" style={{ color: 'var(--accent-strong)', fontWeight: 600 }}>Add your first habit.</Link>
                </div>
              : list.map((h) => <HabitRow key={h.id} habit={h} onToggle={onToggle} />)}
        </Card>

        <div className={styles.rightCol}>
          <Card>
            <div className={styles.ringCard}>
              <span className={styles.cardTitle} style={{ alignSelf: 'flex-start' }}>
                Daily progress
              </span>
              <RingProgress value={ringPct} label={`${ringPct} percent of habits done today`}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26 }} className="tabular">
                    {ringPct}%
                  </div>
                </div>
              </RingProgress>
              <div className={styles.ringStat}>
                <div className={styles.ringStatItem}>
                  <div className={styles.ringStatNum}>{done}/{total}</div>
                  <div className={styles.ringStatLabel}>Habits</div>
                </div>
                <div className={styles.ringStatItem}>
                  <div className={styles.ringStatNum}>{todayXp}</div>
                  <div className={styles.ringStatLabel}>XP today</div>
                </div>
                <div className={styles.ringStatItem}>
                  <div className={styles.ringStatNum}>{streak.data?.current_daily ?? 0}</div>
                  <div className={styles.ringStatLabel}>Streak</div>
                </div>
              </div>
            </div>
          </Card>
          <MentorCard title={coach.name} message={coachDashboardMessage(coach, done, total)} />
        </div>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <div className={styles.cardHead} style={{ marginBottom: 16 }}>
          <span className={styles.cardTitle}>Activity</span>
          <SegmentedControl
            value={range}
            onChange={setRange}
            ariaLabel="Heatmap range"
            options={[
              { value: 'weeks', label: 'Weeks' },
              { value: 'year', label: 'Year' },
            ]}
          />
        </div>
        {heatmap.isLoading ? (
          <Skeleton height={110} />
        ) : (
          <ContributionHeatmap
            cells={heatmap.data?.cells ?? []}
            cellSize={range === 'year' ? 11 : 13}
          />
        )}
      </Card>

      <div className={styles.row2}>
        <Card>
          <div className={styles.cardHead} style={{ marginBottom: 16 }}>
            <span className={styles.cardTitle}>This week</span>
          </div>
          {analytics.isLoading ? <Skeleton height={150} /> : <WeeklyBarChart bars={weeklyBars} />}
        </Card>

        <Card pad="none">
          <div style={{ padding: '18px 18px 4px' }} className={styles.cardHead}>
            <span className={styles.cardTitle}>Active goals</span>
            <Link to="/goals">
              <Button variant="ghost" size="sm">
                All goals
              </Button>
            </Link>
          </div>
          <div style={{ padding: '0 18px 8px' }}>
            {goals.isLoading ? (
              <Skeleton height={120} />
            ) : topGoals.length === 0 ? (
              <div style={{ padding: '14px 0', color: 'var(--ink-500)' }}>No active goals.</div>
            ) : (
              topGoals.map((g) => (
                <Link key={g.id} to={`/goals/${g.id}`} className={styles.goalItem} style={{ display: 'block' }}>
                  <div className={styles.goalTop}>
                    <span className={styles.goalName}>
                      {g.icon} {g.name}
                    </span>
                    <span className={styles.goalPct}>{g.progress_pct}%</span>
                  </div>
                  <ProgressBar value={g.progress_pct} color={g.color ?? undefined} />
                </Link>
              ))
            )}
          </div>
        </Card>
      </div>

      {recentBadges.length > 0 && (
        <Card>
          <div className={styles.cardHead} style={{ marginBottom: 14 }}>
            <span className={styles.cardTitle}>Recent achievements</span>
            <Link to="/achievements">
              <Button variant="ghost" size="sm">
                Trophy case
              </Button>
            </Link>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {recentBadges.map((b) => (
              <Badge key={b.code} tone="active">
                {b.icon} {b.name}
              </Badge>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
