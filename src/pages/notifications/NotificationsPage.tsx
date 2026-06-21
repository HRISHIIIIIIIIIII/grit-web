import { useState } from 'react';
import { useMarkAllRead, useMarkRead, useNotifications, useSettings, useUpdateSettings } from '@/api/hooks/misc';
import { Button, Card, SegmentedControl, Skeleton, Toggle } from '@/components/primitives';
import { PageHeader } from '@/components/PageHeader';
import { relativeTime } from '@/lib/time';
import { cx } from '@/lib/cx';
import styles from './Notifications.module.css';

const TYPE_META: Record<string, { label: string; icon: string; bg: string; color: string }> = {
  streak_protection: { label: 'Streak', icon: '🔥', bg: '#FFE9E2', color: '#C2410C' },
  milestone: { label: 'Milestone', icon: '🎯', bg: '#FFF6DF', color: '#B8710A' },
  achievement: { label: 'Achievement', icon: '🏆', bg: '#FEF3C7', color: '#B45309' },
  accountability: { label: 'Accountability', icon: '⚡', bg: '#F0F1F3', color: '#494D54' },
  reengagement: { label: 'Comeback', icon: '👋', bg: '#E8F0FE', color: '#2563EB' },
  review: { label: 'Review', icon: '📊', bg: '#EDE9FE', color: '#7C3AED' },
  encouragement: { label: 'Encouragement', icon: '💪', bg: '#E7F6F1', color: '#0B7A5E' },
  social: { label: 'Social', icon: '👥', bg: '#E0F4F8', color: '#0E7490' },
};

type FilterValue = 'all' | 'streaks' | 'milestones' | 'accountability' | 'reviews';
const FILTERS: { value: FilterValue; label: string; types: string[] }[] = [
  { value: 'all', label: 'All', types: [] },
  { value: 'streaks', label: 'Streaks', types: ['streak_protection'] },
  { value: 'milestones', label: 'Milestones', types: ['milestone', 'achievement'] },
  { value: 'accountability', label: 'Accountability', types: ['accountability', 'reengagement'] },
  { value: 'reviews', label: 'Reviews', types: ['review'] },
];

const TOGGLES: { key: string; label: string }[] = [
  { key: 'notify_streak_protection', label: 'Streak protection' },
  { key: 'notify_milestone', label: 'Milestones' },
  { key: 'notify_accountability', label: 'Accountability' },
  { key: 'notify_reengagement', label: 'Re-engagement' },
  { key: 'notify_review', label: 'Reviews' },
  { key: 'notify_achievement', label: 'Achievements' },
  { key: 'notify_encouragement', label: 'Encouragement' },
  { key: 'notify_social', label: 'Social' },
];

const TONES = [
  { value: 'gentle', label: 'Gentle' },
  { value: 'hard', label: 'Hard' },
  { value: 'relentless', label: 'Relentless' },
] as const;

export function NotificationsPage() {
  const notifications = useNotifications();
  const markRead = useMarkRead();
  const markAll = useMarkAllRead();
  const settings = useSettings();
  const update = useUpdateSettings();
  const [filter, setFilter] = useState<FilterValue>('all');

  const activeFilter = FILTERS.find((f) => f.value === filter)!;
  const items = (notifications.data ?? []).filter(
    (n) => activeFilter.types.length === 0 || activeFilter.types.includes(n.type),
  );
  const s = settings.data;

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle="FROM ATLAS"
        actions={
          <Button variant="secondary" onClick={() => markAll.mutate()}>
            Mark all read
          </Button>
        }
      />

      <div className={styles.split}>
        <Card pad="none">
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
            <SegmentedControl
              value={filter}
              onChange={setFilter}
              ariaLabel="Filter notifications"
              options={FILTERS.map((f) => ({ value: f.value, label: f.label }))}
            />
          </div>
          {notifications.isLoading ? (
            <div style={{ padding: 18 }}>
              <Skeleton height={200} />
            </div>
          ) : items.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--ink-500)' }}>
              You&apos;re all caught up. ATLAS will nudge you when it matters.
            </div>
          ) : (
            items.map((n) => {
              const meta = TYPE_META[n.type] ?? TYPE_META.encouragement;
              const unread = !n.read_at;
              return (
                <button
                  key={n.id}
                  className={cx(styles.row, unread && styles.unread)}
                  onClick={() => unread && markRead.mutate(n.id)}
                >
                  <span className={styles.icon} style={{ background: meta.bg }}>
                    {meta.icon}
                  </span>
                  <div className={styles.rowMeta}>
                    <div className={styles.rowHead}>
                      <span className={styles.typeTag} style={{ color: meta.color }}>
                        {meta.label}
                      </span>
                      <span className={styles.time}>{relativeTime(n.created_at)}</span>
                    </div>
                    <div className={styles.title}>{n.title}</div>
                    <div className={styles.body}>{n.body}</div>
                  </div>
                  {unread && <span className={styles.dot} />}
                </button>
              );
            })
          )}
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <div className={styles.colTitle}>ATLAS tone</div>
            {s && (
              <SegmentedControl
                value={s.mentor_tone}
                onChange={(tone) => update.mutate({ mentor_tone: tone })}
                ariaLabel="Mentor tone"
                options={TONES.map((t) => ({ value: t.value, label: t.label }))}
              />
            )}
          </Card>

          <Card>
            <div className={styles.colTitle}>Notification types</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {TOGGLES.map((t) => (
                <label key={t.key} className={styles.toggleRow}>
                  <span>{t.label}</span>
                  <Toggle
                    checked={Boolean(s?.[t.key as keyof typeof s])}
                    onChange={(v) => update.mutate({ [t.key]: v })}
                    label={t.label}
                  />
                </label>
              ))}
            </div>
          </Card>

          <Card>
            <div className={styles.colTitle}>Quiet hours</div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <input
                type="time"
                className={styles.timeInput}
                value={s?.quiet_hours_start?.slice(0, 5) ?? ''}
                onChange={(e) => update.mutate({ quiet_hours_start: e.target.value || null })}
                aria-label="Quiet hours start"
              />
              <span style={{ color: 'var(--ink-400)' }}>to</span>
              <input
                type="time"
                className={styles.timeInput}
                value={s?.quiet_hours_end?.slice(0, 5) ?? ''}
                onChange={(e) => update.mutate({ quiet_hours_end: e.target.value || null })}
                aria-label="Quiet hours end"
              />
            </div>
            <p style={{ fontSize: 12, color: 'var(--ink-400)', marginTop: 10 }}>
              ATLAS stays silent during these hours.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
