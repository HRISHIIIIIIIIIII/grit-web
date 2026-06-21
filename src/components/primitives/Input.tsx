import { forwardRef } from 'react';
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cx } from '@/lib/cx';
import styles from './Input.module.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className, id, ...rest },
  ref,
) {
  const field = (
    <input
      ref={ref}
      id={id}
      className={cx(styles.field, error && styles.error, className)}
      aria-invalid={!!error}
      {...rest}
    />
  );
  if (!label && !error) return field;
  return (
    <div>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}
      {field}
      {error && <div className={styles.errorText}>{error}</div>}
    </div>
  );
});

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  mono?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { mono, className, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={cx(styles.field, styles.textarea, mono && styles.mono, className)}
      {...rest}
    />
  );
});
