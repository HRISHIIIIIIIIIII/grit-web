import { useState } from 'react';
import { useAnalytics } from '@/api/hooks/progress';
import { AreaChart, Donut, TimeOfDayBars, VelocityBars } from '@/components/charts';
import { Card, SegmentedControl, Skeleton } from '@/components/primitives';
import { PageHeader } from '@/components/PageHeader';
import { categoryStyle } from '@/lib/categories';
import styles from './Analytics.module.css';

type Period = 'week' | 'month' | 'year';

export function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>('week');
  const analytics = useAnalytics(period);
  const a = analytics.data;

  const kpis = [
    { label: 'Check-ins', value: a?.total_checkins ?? 0 },
    { label: 'Active days', value: a?.active_days ?? 0 },
    { label: 'Perfect days', value: a?.perfect_days ?? 0 },
    { label: 'XP earned', value: a?.xp_earned ?? 0 },
  ];

  const donutSegments = (a?.by_category ?? []).map((c) => ({
    label: c.category,
    value: c.count,
    color: categoryStyle(c.category).color,
  }));

  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle="YOUR DISCIPLINE, MEASURED"
        actions={
          <SegmentedControl
            value={period}
            onChange={setPeriod}
            ariaLabel="Period"
            options={[
              { value: 'week', label: 'Week' },
              { value: 'month', label: 'Month' },
              { value: 'year', label: 'Year' },
            ]}
          />
        }
      />

      {analytics.isLoading ? (
        <Skeleton height={400} />
      ) : (
        <>
          <div className={styles.kpiGrid}>
            {kpis.map((k) => (
              <Card key={k.label} pad="md">
                <div className={`${styles.kpiValue} tabular`}>{k.value.toLocaleString()}</div>
                <div className={styles.kpiLabel}>{k.label}</div>
              </Card>
            ))}
          </div>

          <div className={styles.split155}>
            <Card>
              <div className={styles.cardTitle}>Consistency trend</div>
              <AreaChart points={(a?.trend ?? []).map((p) => ({ label: p.label, value: p.value }))} />
            </Card>
            <Card>
              <div className={styles.cardTitle}>By category</div>
              <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
                <Donut segments={donutSegments} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {donutSegments.map((s) => (
                    <div key={s.label} className={styles.legendRow}>
                      <span className={styles.legendDot} style={{ background: s.color }} />
                      <span className={styles.legendName}>{s.label}</span>
                      <span className={styles.legendVal}>{s.value}</span>
                    </div>
                  ))}
                  {donutSegments.length === 0 && (
                    <span style={{ color: 'var(--ink-400)', fontSize: 14 }}>No check-ins yet.</span>
                  )}
                </div>
              </div>
            </Card>
          </div>

          <div className={styles.split113}>
            <Card>
              <div className={styles.cardTitle}>Time of day</div>
              <TimeOfDayBars buckets={a?.time_of_day ?? []} />
            </Card>
            <Card>
              <div className={styles.cardTitle}>Roadmap velocity</div>
              <VelocityBars rows={(a?.velocity ?? []).map((v) => ({ title: v.title, value: v.topics_done }))} />
            </Card>
          </div>

          <Card dark>
            <div style={{ position: 'relative' }}>
              <div className={styles.cardTitle} style={{ color: '#fff' }}>
                {period === 'week' ? 'Weekly' : period === 'month' ? 'Monthly' : 'Yearly'} review
              </div>
              <div className={styles.reviewGrid}>
                <Review label="Check-ins" value={a?.total_checkins ?? 0} />
                <Review label="Active days" value={a?.active_days ?? 0} />
                <Review label="Longest streak" value={a?.records.longest_streak ?? 0} />
                <Review label="Best day" value={a?.records.best_day_count ?? 0} />
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

function Review({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, color: '#fff' }} className="tabular">
        {value.toLocaleString()}
      </div>
      <div style={{ fontSize: 12, color: 'var(--ink-400)', fontWeight: 600 }}>{label}</div>
    </div>
  );
}
