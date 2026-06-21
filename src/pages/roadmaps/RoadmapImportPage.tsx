import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useImportRoadmap } from '@/api/hooks/roadmaps';
import { ApiError } from '@/api/client';
import { Button, Card, Icon, Textarea, Toggle } from '@/components/primitives';
import { PageHeader } from '@/components/PageHeader';
import styles from './Roadmaps.module.css';

const SAMPLE = `# My Roadmap

## Phase 1: Fundamentals (Week 1)
- First topic
- Second topic

## Phase 2: Going deeper (Week 2)
### A subtopic
- Another item`;

interface PickedFile {
  name: string;
  content: string;
}

export function RoadmapImportPage() {
  const navigate = useNavigate();
  const importRoadmap = useImportRoadmap();
  const fileInput = useRef<HTMLInputElement>(null);
  const [markdown, setMarkdown] = useState('');
  const [isDsa, setIsDsa] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<PickedFile[]>([]);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);

  const onFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setError(null);
    const picked: PickedFile[] = await Promise.all(
      Array.from(fileList).map(async (f) => ({ name: f.name, content: await f.text() })),
    );
    if (picked.length === 1) {
      // Single file → load into the editor for review.
      setMarkdown(picked[0].content);
      setFiles([]);
    } else {
      // Multiple files → bulk-import mode.
      setFiles(picked);
      setMarkdown('');
    }
  };

  const submitOne = async () => {
    if (!markdown.trim()) return;
    setError(null);
    try {
      const detail = await importRoadmap.mutateAsync({ markdown, is_dsa_linked: isDsa });
      navigate(`/roadmaps/${detail.id}`);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not import. Check your markdown.');
    }
  };

  const submitBulk = async () => {
    setError(null);
    setProgress({ done: 0, total: files.length });
    try {
      for (let i = 0; i < files.length; i++) {
        await importRoadmap.mutateAsync({ markdown: files[i].content, is_dsa_linked: isDsa });
        setProgress({ done: i + 1, total: files.length });
      }
      navigate('/roadmaps');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'One of the files could not be imported.');
      setProgress(null);
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
          Upload one or more <code className="mono">.md</code> files, or paste markdown —{' '}
          <code className="mono">#</code> is the title, <code className="mono">##</code> phases (a
          trailing <code className="mono">(duration)</code> is parsed out), and{' '}
          <code className="mono">###</code> headings or <code className="mono">-</code> bullets
          become topics.
        </p>

        {/* File picker */}
        <input
          ref={fileInput}
          type="file"
          accept=".md,.markdown,.txt,text/markdown"
          multiple
          hidden
          onChange={(e) => onFiles(e.target.files)}
        />
        <button
          type="button"
          className={styles.dropZone}
          onClick={() => fileInput.current?.click()}
        >
          <Icon name="export" size={22} style={{ color: 'var(--accent-strong)' }} />
          <span style={{ fontWeight: 600 }}>Choose .md file(s)</span>
          <span style={{ fontSize: 12, color: 'var(--ink-400)' }}>
            One file loads into the editor · multiple files import in bulk
          </span>
        </button>

        {files.length > 0 ? (
          /* Bulk mode */
          <div style={{ marginTop: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>
              {files.length} files ready to import
            </div>
            <div className={styles.fileList}>
              {files.map((f) => (
                <div key={f.name} className={styles.fileRow}>
                  <Icon name="roadmap" size={16} style={{ color: 'var(--ink-400)' }} />
                  <span style={{ flex: 1 }}>{f.name}</span>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--ink-400)' }}>
                    {(f.content.length / 1024).toFixed(1)}kb
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Single / paste mode */
          <div style={{ marginTop: 16 }}>
            <Textarea
              mono
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder={SAMPLE}
              rows={14}
              aria-label="Roadmap markdown"
            />
          </div>
        )}

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

          {files.length > 0 ? (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Button variant="secondary" onClick={() => setFiles([])}>
                Clear
              </Button>
              <Button onClick={submitBulk} disabled={!!progress}>
                {progress
                  ? `Importing ${progress.done}/${progress.total}…`
                  : `Import ${files.length} roadmaps`}
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 10 }}>
              <Button variant="secondary" onClick={() => setMarkdown(SAMPLE)}>
                Use sample
              </Button>
              <Button onClick={submitOne} disabled={importRoadmap.isPending || !markdown.trim()}>
                {importRoadmap.isPending ? 'Importing…' : 'Import'}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
