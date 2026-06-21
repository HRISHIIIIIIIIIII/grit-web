import { Link } from 'react-router-dom';
import { useMe } from '@/api/hooks/auth';
import { useAchievements } from '@/api/hooks/misc';
import { useHeatmap, useLevel, useStreak } from '@/api/hooks/progress';
import { ContributionHeatmap, LevelLadder } from '@/components/charts';
import { Avatar, Badge, Button, Card, Icon, ProgressBar, Skeleton } from '@/components/primitives';
import styles from './Profile.module.css';

export function ProfilePage() {
  const me = useMe();
  const level = useLevel();
  const streak = useStreak();
  const heatmap = useHeatmap('year');
  const achievements = useAchievements();

  const unlocked = (achievements.data ?? []).filter((a) => a.unlocked);
  const activeDays = (heatmap.data?.cells ?? []).filter((c) => c.count > 0).length;

  const stats = [
    { label: 'Current streak', value: streak.data?.current_daily ?? 0, icon: '🔥' },
    { label: 'Longest streak', value: streak.data?.longest ?? 0, icon: '🏔️' },
    { label: 'Achievements', value: unlocked.length, icon: '🏆' },
    { label: 'Active days', value: activeDays, icon: '📅' },
  ];

  return (
    <div>
      <Card dark style={{ marginBottom: 16 }}>
        <div className={styles.hero}>
          <Avatar name={me.data?.display_name ?? 'You'} size={104} />
          <div style={{ flex: 1 }}>
            <div className={styles.heroTop}>
              <h1 style={{ color: '#fff', fontSize: 30 }}>{me.data?.display_name ?? '—'}</h1>
              {me.data && (
                <Badge tone="xp">
                  Lv {me.data.level} · {me.data.level_name}
                </Badge>
              )}
            </div>
            {me.data?.identity_word && (
              <p className={styles.identity}>Becoming {me.data.identity_word}</p>
            )}
            {level.data && (
              <div className={styles.xpWrap}>
                <ProgressBar value={level.data.progress_pct} />
                <div className={styles.xpMeta}>
                  <span>{level.data.xp_total.toLocaleString()} XP</span>
                  {level.data.next_threshold != null ? (
                    <span>
                      {level.data.xp_to_next?.toLocaleString()} XP to{' '}
                      {level.data.next_threshold.toLocaleString()}
                    </span>
                  ) : (
                    <span>Max level</span>
                  )}
                </div>
              </div>
            )}
          </div>
          <Link to="/settings">
            <Button variant="secondary">
              <Icon name="settings" size={17} /> Settings
            </Button>
          </Link>
        </div>
      </Card>

      <div className={styles.statGrid}>
        {stats.map((s) => (
          <Card key={s.label} pad="md">
            <div style={{ fontSize: 22 }}>{s.icon}</div>
            <div className={`${styles.statVal} tabular`}>{s.value.toLocaleString()}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </Card>
        ))}
      </div>

      <div className={styles.split}>
        <Card>
          <div className={styles.cardTitle}>Progression</div>
          {level.isLoading ? <Skeleton height={300} /> : <LevelLadder currentLevel={me.data?.level ?? 1} />}
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card dark>
            <div style={{ position: 'relative', textAlign: 'center', padding: '8px 0' }}>
              <div style={{ color: 'var(--ink-400)', fontSize: 13, marginBottom: 8 }}>I am becoming</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 30, color: '#fff' }}>
                {me.data?.identity_word ?? 'Relentless'}
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 14, flexWrap: 'wrap' }}>
                {(me.data?.focus_areas ?? []).slice(0, 4).map((f) => (
                  <span key={f} className={styles.focusTag}>
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </Card>
          <Card>
            <div className={styles.cardTitle}>Recent badges</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {unlocked.slice(0, 8).map((a) => (
                <span key={a.code} className={styles.badge} title={a.name}>
                  {a.icon}
                </span>
              ))}
              {unlocked.length === 0 && <span style={{ color: 'var(--ink-400)' }}>None yet.</span>}
            </div>
          </Card>
        </div>
      </div>

      <Card style={{ marginTop: 16 }}>
        <div className={styles.cardTitle}>This year</div>
        {heatmap.isLoading ? (
          <Skeleton height={120} />
        ) : (
          <ContributionHeatmap cells={heatmap.data?.cells ?? []} cellSize={11} />
        )}
      </Card>
    </div>
  );
}
