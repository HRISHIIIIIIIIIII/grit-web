import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useRoadmap, useToggleTopic } from '@/api/hooks/roadmaps';
import type { PhaseRead, TopicRead } from '@/api/types';
import { RingProgress } from '@/components/charts';
import { Card, Checkbox, Icon, Skeleton, useToast } from '@/components/primitives';
import { cx } from '@/lib/cx';
import styles from './Roadmaps.module.css';

function Phase({
  phase,
  onToggle,
}: {
  phase: PhaseRead;
  onToggle: (t: TopicRead, done: boolean) => void;
}) {
  const [open, setOpen] = useState(!phase.complete);
  return (
    <div className={styles.phase}>
      <button className={styles.phaseHead} onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <Icon name="chevronRight" size={18} className={cx(styles.chev, open && styles.chevOpen)} />
        <span className={styles.phaseName}>{phase.name}</span>
        {phase.duration_label && <span className={styles.phaseDur}>{phase.duration_label}</span>}
        {phase.complete ? (
          <Icon name="check" size={18} className={styles.complete} strokeWidth={2.4} />
        ) : (
          <span className={styles.phaseCount}>
            {phase.done_count}/{phase.total_count}
          </span>
        )}
      </button>
      {open &&
        phase.topics.map((t) => (
          <div key={t.id} className={cx(styles.topic, t.done && styles.topicDone)}>
            <Checkbox
              checked={t.done}
              onChange={(next) => onToggle(t, next)}
              label={t.name}
            />
            <span className={styles.topicName}>{t.name}</span>
          </div>
        ))}
    </div>
  );
}

export function RoadmapDetailPage() {
  const { id } = useParams();
  const roadmapId = Number(id);
  const roadmap = useRoadmap(roadmapId);
  const toggle = useToggleTopic(roadmapId);
  const { toast } = useToast();

  const onToggle = async (t: TopicRead, done: boolean) => {
    const res = await toggle.mutateAsync({ topicId: t.id, done });
    if (done && res.dsa_habit_credited) {
      toast('DSA habit credited for today 🔥', undefined);
    } else if (done && res.phase_complete) {
      toast('Phase complete! +' + res.xp_awarded + ' XP');
    }
  };

  if (roadmap.isLoading) return <Skeleton height={300} />;
  if (roadmap.isError || !roadmap.data)
    return (
      <Card>
        <p style={{ padding: 24 }}>Roadmap not found.</p>
      </Card>
    );

  const r = roadmap.data;

  return (
    <div>
      <Link to="/roadmaps" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--ink-500)', fontWeight: 600, fontSize: 14, marginBottom: 16 }}>
        <Icon name="arrowLeft" size={18} /> Roadmaps
      </Link>

      <Card style={{ marginBottom: 20 }}>
        <div className={styles.detailHead}>
          <span className={styles.iconBox} style={{ width: 64, height: 64, fontSize: 30 }}>
            {r.icon ?? '🗺️'}
          </span>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 26 }}>{r.title}</h1>
            <p style={{ color: 'var(--ink-500)', marginTop: 4 }} className="mono">
              {r.done_topics}/{r.total_topics} topics · {r.phases.length} phases
              {r.is_dsa_linked && ' · DSA-linked'}
            </p>
          </div>
          <RingProgress value={r.progress_pct} size={92} strokeWidth={10}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20 }} className="tabular">
              {r.progress_pct}%
            </div>
          </RingProgress>
        </div>
      </Card>

      {r.phases.map((p) => (
        <Phase key={p.id} phase={p} onToggle={onToggle} />
      ))}
    </div>
  );
}
