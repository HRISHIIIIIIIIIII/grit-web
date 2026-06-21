import type { ReactNode } from 'react';

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 24,
        flexWrap: 'wrap',
      }}
    >
      <div>
        {subtitle && (
          <div
            className="mono"
            style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-400)', marginBottom: 6, letterSpacing: '0.04em' }}
          >
            {subtitle}
          </div>
        )}
        <h1 style={{ fontSize: 32 }}>{title}</h1>
      </div>
      {actions && <div style={{ display: 'flex', gap: 10 }}>{actions}</div>}
    </div>
  );
}
