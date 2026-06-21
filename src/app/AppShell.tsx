import { Outlet } from 'react-router-dom';
import { ToastProvider } from '@/components/primitives';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { ThemeSync } from './ThemeSync';
import styles from './AppShell.module.css';

export function AppShell() {
  return (
    <ToastProvider>
      <ThemeSync />
      <div className={styles.shell}>
        <Sidebar />
        <div className={styles.main}>
          <TopBar />
          <div className={styles.content}>
            <Outlet />
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}
