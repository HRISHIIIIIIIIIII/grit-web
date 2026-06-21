import type { ReactNode } from 'react';
import styles from './AuthLayout.module.css';

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className={styles.wrap}>
      <aside className={styles.brand}>
        <div className={styles.glow} aria-hidden="true" />
        <div className={styles.brandInner}>
          <div className={styles.logo}>GRIT</div>
          <h2 className={styles.tagline}>Build discipline.
            <br />
            Track real progress.</h2>
          <p className={styles.brandCopy}>
            Habits, goals, roadmaps, streaks and an AI mentor — one relentless system for becoming
            who you said you would.
          </p>
        </div>
      </aside>
      <main className={styles.panel}>
        <div className={styles.card}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
          {children}
          <div className={styles.footer}>{footer}</div>
        </div>
      </main>
    </div>
  );
}
