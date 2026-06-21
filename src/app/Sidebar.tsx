import { NavLink } from 'react-router-dom';
import { useMe } from '@/api/hooks/auth';
import { Avatar, Icon } from '@/components/primitives';
import type { IconName } from '@/components/primitives';
import { cx } from '@/lib/cx';
import styles from './Sidebar.module.css';

const NAV: { to: string; label: string; icon: IconName; end?: boolean }[] = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/habits', label: 'Habits', icon: 'habit' },
  { to: '/goals', label: 'Goals', icon: 'goal' },
  { to: '/roadmaps', label: 'Roadmaps', icon: 'roadmap' },
  { to: '/streaks', label: 'Streaks', icon: 'fire' },
  { to: '/achievements', label: 'Achievements', icon: 'award' },
  { to: '/analytics', label: 'Analytics', icon: 'analytics' },
  { to: '/community', label: 'Community', icon: 'community' },
  { to: '/coaches', label: 'Coaches', icon: 'sparkle' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
  { to: '/profile', label: 'Profile', icon: 'profile' },
];

export function Sidebar() {
  const me = useMe();
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.dot} />
        <span className={styles.logoText}>GRIT</span>
      </div>
      <nav className={styles.nav}>
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) => cx(styles.item, isActive && styles.active)}
            title={n.label}
          >
            <Icon name={n.icon} size={20} />
            <span className={styles.label}>{n.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className={styles.user}>
        <Avatar name={me.data?.display_name ?? 'You'} src={me.data?.avatar_url} size={36} />
        <div className={styles.userMeta}>
          <div className={styles.userName}>{me.data?.display_name ?? '—'}</div>
          <div className={styles.userSub}>
            {me.data ? `Lv ${me.data.level} · ${me.data.level_name}` : ''}
          </div>
        </div>
      </div>
    </aside>
  );
}
