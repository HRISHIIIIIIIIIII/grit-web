import { useMemo, useState } from 'react';
import { useAchievements } from '@/api/hooks/misc';
import type { AchievementRead } from '@/api/types';
import { Card, ProgressBar, SegmentedControl, Skeleton } from '@/components/primitives';
import { PageHeader } from '@/components/PageHeader';
import { cx } from '@/lib/cx';
import styles from './Achievements.module.css';

const TIER_COLOR: Record<string, string> = {
  Common: '#0EA47F',
  Rare: '#2563EB',
  Epic: '#7C3AED',
  Legendary: '#F5B301',
  Hidden: '#6C7077',
};

type Filter = 'all' | 'unlocked' | 'progress' | 'locked';

export function AchievementsPage() {
  const achievements = useAchievements();
  const [filter, setFilter] = useState<Filter>('all');

  const list = achievements.data ?? [];
  const unlockedCount = list.filter((a) => a.unlocked).length;

  const tiers = useMemo(() => {
    const order = ['Common', 'Rare', 'Epic', 'Legendary'];
    return order.map((tier) => {
      const items = list.filter((a) => a.tier === tier);
      return { tier, total: items.length, done: items.filter((a) => a.unlocked).length };
    });
  }, [list]);

  const filtered = list.filter((a) => {
    if (filter === 'unlocked') return a.unlocked;
    if (filter === 'locked') return !a.unlocked && a.progress === 0;
    if (filter === 'progress') return !a.unlocked && a.progress > 0;
    return true;
  });

  return (
    <div>
      <PageHeader
        title="Achievements"
        subtitle={`${unlockedCount} of ${list.length} unlocked`}
      />

      {achievements.isLoading ? (
        <Skeleton height={300} />
      ) : (
        <>
          <Card dark style={{ marginBottom: 16 }}>
            <div style={{ position: 'relative' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, marginBottom: 16 }}>
                Trophy case
              </div>
              <div className={styles.trophyRow}>
                {list
                  .filter((a) => a.unlocked)
                  .slice(0, 6)
                  .map((a) => (
                    <div key={a.code} className={styles.trophy} title={a.name}>
                      <span style={{ fontSize: 30 }}>{a.icon}</span>
                      <span className={styles.trophyName}>{a.name}</span>
                    </div>
                  ))}
                {unlockedCount === 0 && (
                  <p style={{ color: 'var(--ink-400)' }}>Unlock achievements to fill your case.</p>
                )}
              </div>
            </div>
          </Card>

          <div className={styles.tierGrid}>
            {tiers.map((t) => (
              <Card key={t.tier} pad="sm">
                <div className={styles.tierTop}>
                  <span className={styles.tierDot} style={{ background: TIER_COLOR[t.tier] }} />
                  <span className={styles.tierName}>{t.tier}</span>
                  <span className={styles.tierCount}>
                    {t.done}/{t.total}
                  </span>
                </div>
                <ProgressBar
                  value={t.total ? (t.done / t.total) * 100 : 0}
                  height={6}
                  color={TIER_COLOR[t.tier]}
                />
              </Card>
            ))}
          </div>

          <div style={{ margin: '20px 0 16px' }}>
            <SegmentedControl
              value={filter}
              onChange={setFilter}
              ariaLabel="Filter achievements"
              options={[
                { value: 'all', label: 'All' },
                { value: 'unlocked', label: 'Unlocked' },
                { value: 'progress', label: 'In progress' },
                { value: 'locked', label: 'Locked' },
              ]}
            />
          </div>

          <div className={styles.badgeGrid}>
            {filtered.map((a) => (
              <BadgeCard key={a.code} a={a} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function BadgeCard({ a }: { a: AchievementRead }) {
  const locked = !a.unlocked;
  return (
    <Card
      className={cx(styles.badgeCard, locked && styles.badgeLocked, a.tier === 'Legendary' && a.unlocked && styles.legendary)}
      pad="md"
    >
      <div
        className={styles.badgeIcon}
        style={{ background: a.unlocked ? `${TIER_COLOR[a.tier]}22` : 'var(--surface)' }}
      >
        {a.icon}
      </div>
      <div className={styles.badgeName}>{a.name}</div>
      <div className={styles.badgeDesc}>{a.description}</div>
      {a.unlocked ? (
        <div className={styles.badgeUnlocked}>✓ Unlocked</div>
      ) : a.progress > 0 ? (
        <div style={{ marginTop: 'auto' }}>
          <ProgressBar value={(a.progress / a.target) * 100} height={6} color={TIER_COLOR[a.tier]} />
          <div className={styles.badgeProgress}>
            {a.progress}/{a.target}
          </div>
        </div>
      ) : (
        <div className={styles.badgeProgress}>{a.hidden ? 'Hidden' : 'Locked'}</div>
      )}
    </Card>
  );
}
