import { Card } from '@/components/primitives';
import { PageHeader } from '@/components/PageHeader';

/* Temporary stand-in for screens not yet built. Replaced screen by screen. */
export function Placeholder({ title }: { title: string }) {
  return (
    <div>
      <PageHeader title={title} subtitle="COMING UP" />
      <Card pad="lg">
        <p style={{ color: 'var(--ink-500)' }}>This screen is being built.</p>
      </Card>
    </div>
  );
}
