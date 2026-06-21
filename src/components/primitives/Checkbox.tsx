import { cx } from '@/lib/cx';
import styles from './Checkbox.module.css';

export interface CheckboxProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  size?: 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export function Checkbox({
  checked,
  onChange,
  label,
  size = 'md',
  disabled,
  className,
}: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      className={cx(styles.box, checked && styles.checked, size === 'lg' && styles.lg, className)}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
    >
      <svg
        className={cx(styles.check, checked && styles.checkOn)}
        width={size === 'lg' ? 16 : 13}
        height={size === 'lg' ? 16 : 13}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6,12 10,16 18,7" />
      </svg>
    </button>
  );
}
