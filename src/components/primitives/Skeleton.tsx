import { cx } from '@/lib/cx';
import styles from './Skeleton.module.css';

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  className?: string;
}

export function Skeleton({ width = '100%', height = 16, radius, className }: SkeletonProps) {
  return (
    <div
      className={cx(styles.sk, className)}
      style={{ width, height, borderRadius: radius }}
      aria-hidden="true"
    />
  );
}
