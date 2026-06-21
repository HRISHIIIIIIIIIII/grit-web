import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useImportRoadmap } from '@/api/hooks/roadmaps';
import { ApiError } from '@/api/client';
import { Button, Card, Icon, Textarea, Toggle } from '@/components/primitives';
import { PageHeader } from '@/components/PageHeader';

const SAMPLE = `# My Roadmap

## Phase 1: Fundamentals (Week 1)
- First topic
- Second topic

## Phase 2: Going deeper (Week 2)
### A subtopic
- Another item`;

export function RoadmapImportPage() {
  const navigate = useNavigate();
  const importRoadmap = useImportRoadmap();
  const [markdown, setMarkdown] = useState('');
  const [isDsa, setIsDsa] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!markdown.trim()) return;
    setError(null);
    try {
      const detail = await importRoadmap.mutateAsync({ markdown, is_dsa_linked: isDsa });
      navigate(`/roadmaps/${detail.id}`);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not import. Check your markdown.');
    }
  };

  return (
    <div>
      <Link
        to="/roadmaps"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--ink-500)', fontWeight: 600, fontSize: 14, marginBottom: 16 }}
      >
        <Icon name="arrowLeft" size={18} /> Roadmaps
      </Link>
      <PageHeader title="Import roadmap" subtitle="MARKDOWN → TOPICS" />

      <Card pad="lg" style={{ maxWidth: 760 }}>
        <p style={{ color: 'var(--ink-500)', marginBottom: 16, fontSize: 14 }}>
          Paste markdown — <code className="mono">#</code> is the title,{' '}
          <code className="mono">##</code> phases (a trailing <code className="mono">(duration)</code>{' '}
          is parsed out), and <code className="mono">###</code> headings or{' '}
          <code className="mono">-</code> bullets become topics.
        </p>
        <Textarea
          mono
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          placeholder={SAMPLE}
          rows={16}
          aria-label="Roadmap markdown"
        />
        {error && (
          <div style={{ color: 'var(--danger)', fontSize: 13, fontWeight: 500, marginTop: 10 }}>
            {error}
          </div>
        )}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 18,
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <Toggle checked={isDsa} onChange={setIsDsa} label="Link to DSA habit" />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Link to DSA habit</div>
              <div style={{ fontSize: 12, color: 'var(--ink-400)' }}>
                Checking a topic credits your DSA habit for today.
              </div>
            </div>
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="secondary" onClick={() => setMarkdown(SAMPLE)}>
              Use sample
            </Button>
            <Button onClick={submit} disabled={importRoadmap.isPending || !markdown.trim()}>
              {importRoadmap.isPending ? 'Importing…' : 'Import'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
