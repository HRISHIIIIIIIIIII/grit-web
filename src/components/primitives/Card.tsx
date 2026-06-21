import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '@/lib/cx';
import styles from './Card.module.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  pad?: 'none' | 'sm' | 'md' | 'lg';
  dark?: boolean;
  interactive?: boolean;
  children: ReactNode;
}

export function Card({
  pad = 'md',
  dark = false,
  interactive = false,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={cx(
        styles.card,
        styles[`pad-${pad}`],
        dark && styles.dark,
        interactive && styles.interactive,
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
