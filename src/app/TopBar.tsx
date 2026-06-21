import { useNavigate } from 'react-router-dom';
import { useMe } from '@/api/hooks/auth';
import { useNotifications } from '@/api/hooks/misc';
import { useStreak } from '@/api/hooks/progress';
import { Icon } from '@/components/primitives';
import styles from './TopBar.module.css';

export function TopBar() {
  const navigate = useNavigate();
  const me = useMe();
  const streak = useStreak();
  const notifications = useNotifications();
  const unread = notifications.data?.filter((n) => !n.read_at).length ?? 0;

  return (
    <header className={styles.bar}>
      <div className={styles.search}>
        <Icon name="search" size={18} />
        <input placeholder="Search habits, goals, roadmaps…" aria-label="Search" />
      </div>
      <div className={styles.right}>
        {streak.data && (
          <span className={`${styles.pill} ${styles.streak}`} title="Current streak">
            🔥 {streak.data.current_daily}d
          </span>
        )}
        {me.data && (
          <span className={`${styles.pill} ${styles.xp}`} title="Total XP">
            <Icon name="xp" size={14} style={{ color: 'var(--xp-gold-b)' }} />
            {me.data.xp_total.toLocaleString()}
          </span>
        )}
        <button
          className={styles.bell}
          onClick={() => navigate('/notifications')}
          aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        >
          <Icon name="notify" size={20} />
          {unread > 0 && <span className={styles.badge}>{unread}</span>}
        </button>
      </div>
    </header>
  );
}
