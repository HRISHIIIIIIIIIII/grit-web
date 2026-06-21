import { useMemo } from 'react';
import { useFreeze, useHeatmap, useStreak } from '@/api/hooks/progress';
import { useToast } from '@/components/primitives';
import {
  EvolutionStages,
  FlameHero,
  MilestoneTrack,
  StreakCalendar,
} from '@/components/charts';
import type { CalendarDay } from '@/components/charts';
import { Button, Card, Skeleton } from '@/components/primitives';
import { PageHeader } from '@/components/PageHeader';

const STREAK_MILESTONES = [
  { label: 'Ember', at: 7 },
  { label: 'Flame', at: 21 },
  { label: 'Blaze', at: 46 },
  { label: 'Inferno', at: 100 },
];

export function StreaksPage() {
  const streak = useStreak();
  const heatmap = useHeatmap('weeks');
  const freeze = useFreeze();
  const { toast } = useToast();

  const calendarDays = useMemo<CalendarDay[]>(() => {
    const cells = heatmap.data?.cells ?? [];
    const last35 = cells.slice(-35);
    return last35.map((c, i): CalendarDay => {
      const isToday = i === last35.length - 1;
      if (isToday) return { state: 'today', label: new Date(c.date).getDate() };
      return { state: c.count > 0 ? 'done' : 'missed' };
    });
  }, [heatmap.data]);

  const onFreeze = async () => {
    const res = await freeze.mutateAsync();
    toast(res.message);
  };

  const s = streak.data;

  return (
    <div>
      <PageHeader title="Streaks" subtitle="THE CHAIN" />

      <Card dark style={{ marginBottom: 16 }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 28, padding: 8 }}>
          <FlameHero />
          <div style={{ flex: 1 }}>
            {streak.isLoading ? (
              <Skeleton height={60} />
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 56, color: '#fff' }} className="tabular">
                    {s?.current_daily ?? 0}
                  </span>
                  <span style={{ color: 'var(--ink-400)', fontSize: 18, fontWeight: 600 }}>day streak</span>
                </div>
                <div style={{ color: 'var(--ink-400)', marginTop: 4 }} className="mono">
                  {s?.evolution_stage} · longest {s?.longest ?? 0} days · this week {s?.weekly_count ?? 0}
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17 }}>Freezes</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24 }} className="tabular">
              {'❄️'.repeat(Math.max(0, s?.freeze_balance ?? 0)) || '—'}
            </span>
          </div>
          <p style={{ color: 'var(--ink-500)', fontSize: 14, marginBottom: 14 }}>
            You earn a freeze every 14 consecutive days (max 3). A missed day auto-consumes one to
            keep your streak alive.
          </p>
          <Button variant="secondary" onClick={onFreeze} disabled={freeze.isPending}>
            Check protection
          </Button>
        </Card>

        <Card>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, marginBottom: 16 }}>
            Last 5 weeks
          </div>
          {heatmap.isLoading ? <Skeleton height={180} /> : <StreakCalendar days={calendarDays} />}
        </Card>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, marginBottom: 6 }}>
          Evolution
        </div>
        <p style={{ color: 'var(--ink-500)', fontSize: 14, marginBottom: 18 }}>
          Your streak evolves as it grows. Keep the chain alive to reach the next stage.
        </p>
        <EvolutionStages current={s?.current_daily ?? 0} />
      </Card>

      <Card>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, marginBottom: 6 }}>
          Next milestones
        </div>
        <MilestoneTrack current={s?.current_daily ?? 0} milestones={STREAK_MILESTONES} />
      </Card>
    </div>
  );
}
