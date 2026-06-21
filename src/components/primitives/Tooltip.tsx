import type { ReactNode } from 'react';
import styles from './Tooltip.module.css';

export interface TooltipProps {
  label: string;
  children: ReactNode;
}

export function Tooltip({ label, children }: TooltipProps) {
  return (
    <span className={styles.wrap}>
      {children}
      <span role="tooltip" className={styles.bubble}>
        {label}
        <span className={styles.arrow} />
      </span>
    </span>
  );
}
