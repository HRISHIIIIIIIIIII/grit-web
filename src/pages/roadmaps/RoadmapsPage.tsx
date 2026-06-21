import { Link, useNavigate } from 'react-router-dom';
import { useRoadmaps } from '@/api/hooks/roadmaps';
import { RingProgress } from '@/components/charts';
import { Button, Card, Icon, Skeleton } from '@/components/primitives';
import { PageHeader } from '@/components/PageHeader';
import styles from './Roadmaps.module.css';

export function RoadmapsPage() {
  const roadmaps = useRoadmaps();
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader
        title="Roadmaps"
        subtitle="STRUCTURED LEARNING"
        actions={
          <Button onClick={() => navigate('/roadmaps/import')}>
            <Icon name="add" size={18} /> Import roadmap
          </Button>
        }
      />

      {roadmaps.isLoading ? (
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height={160} radius={16} />
          ))}
        </div>
      ) : (roadmaps.data ?? []).length === 0 ? (
        <Card>
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--ink-500)' }}>
            <p style={{ fontWeight: 600, marginBottom: 6 }}>No roadmaps yet</p>
            <p style={{ marginBottom: 16 }}>Import a markdown roadmap to start tracking topics.</p>
            <Button onClick={() => navigate('/roadmaps/import')}>Import roadmap</Button>
          </div>
        </Card>
      ) : (
        <div className={styles.grid}>
          {roadmaps.data!.map((r) => (
            <Card key={r.id} interactive style={{ padding: 0 }}>
              <Link to={`/roadmaps/${r.id}`} style={{ display: 'block', padding: 20 }}>
                <div className={styles.card}>
                  <div className={styles.cardTop}>
                    <span className={styles.iconBox} style={{ background: r.color ? `${r.color}1a` : undefined }}>
                      {r.icon ?? '🗺️'}
                    </span>
                    <div>
                      <div className={styles.title}>{r.title}</div>
                      <div className={styles.meta}>
                        {r.done_topics}/{r.total_topics} topics
                      </div>
                    </div>
                  </div>
                  <div className={styles.cardFoot}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span className={styles.pct}>{r.progress_pct}%</span>
                      {r.is_dsa_linked && <span className={styles.dsaTag}>DSA</span>}
                    </div>
                    <RingProgress value={r.progress_pct} size={48} strokeWidth={6}>
                      <Icon name="roadmap" size={16} style={{ color: 'var(--accent-strong)' }} />
                    </RingProgress>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
