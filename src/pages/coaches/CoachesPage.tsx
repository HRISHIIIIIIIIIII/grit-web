import { useEffect, useState } from 'react';
import { useSettings, useUpdateSettings } from '@/api/hooks/misc';
import { Button, Card, Skeleton, useToast } from '@/components/primitives';
import { PageHeader } from '@/components/PageHeader';
import { COACHES, getCoach, type Coach, type CoachId } from '@/lib/coaches';
import { cx } from '@/lib/cx';
import styles from './Coaches.module.css';

function IntensityDots({ value, color }: { value: number; color: string }) {
  return (
    <span className={styles.dots} aria-label={`Intensity ${value} of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={styles.dot}
          style={{ background: i < value ? color : 'rgba(255,255,255,0.18)' }}
        />
      ))}
    </span>
  );
}

export function CoachesPage() {
  const settings = useSettings();
  const update = useUpdateSettings();
  const { toast } = useToast();
  const chosenId = (settings.data?.coach ?? 'atlas') as CoachId;
  const [selectedId, setSelectedId] = useState<CoachId>(chosenId);

  useEffect(() => {
    if (settings.data?.coach) setSelectedId(settings.data.coach as CoachId);
  }, [settings.data?.coach]);

  const selected: Coach = getCoach(selectedId);
  const isChosen = selectedId === chosenId;

  const choose = () => {
    update.mutate({ coach: selected.id, mentor_tone: selected.tone });
    toast(`${selected.name} is now in your corner.`);
  };

  return (
    <div>
      <PageHeader title="Choose your coach" subtitle="YOUR MENTOR, YOUR WAY" />

      {settings.isLoading ? (
        <Skeleton height={280} />
      ) : (
        <>
          <Card dark style={{ marginBottom: 18 }}>
            <div className={styles.hero}>
              <img
                src={selected.image}
                alt={`${selected.name} portrait`}
                className={styles.heroImg}
                style={{ boxShadow: `0 10px 30px ${selected.shadow}` }}
              />
              <div className={styles.heroBody}>
                <div className={styles.heroArche} style={{ color: selected.bright }}>
                  {selected.archetype}
                </div>
                <h2 className={styles.heroName}>{selected.name}</h2>
                <p className={styles.heroTagline}>{selected.tagline}</p>
                <p className={styles.heroBio}>{selected.bio}</p>
                <div className={styles.traits}>
                  {selected.traits.map((t) => (
                    <span key={t} className={styles.trait}>
                      {t}
                    </span>
                  ))}
                </div>
                <div className={styles.intensityRow}>
                  <span className={styles.intensityLabel}>Intensity</span>
                  <IntensityDots value={selected.intensity} color={selected.bright} />
                </div>
                <div className={styles.voiceBlock}>
                  <span className={styles.voiceLabel}>When you win</span>
                  <p className={styles.voiceText}>&ldquo;{selected.voice.win}&rdquo;</p>
                </div>
                <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <Button
                    size="lg"
                    variant={isChosen ? 'secondary' : 'primary'}
                    disabled={isChosen || update.isPending}
                    onClick={choose}
                    style={
                      !isChosen
                        ? { background: '#fff', color: '#0C0D0E' }
                        : undefined
                    }
                  >
                    {isChosen ? '✓ Your coach' : `Choose ${selected.name}`}
                  </Button>
                  {isChosen && (
                    <span className={styles.inCorner}>{selected.name} is in your corner.</span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <div className={styles.grid}>
            {COACHES.map((c) => {
              const active = c.id === selectedId;
              const yours = c.id === chosenId;
              return (
                <button
                  key={c.id}
                  className={cx(styles.coachCard, active && styles.coachActive)}
                  style={active ? { borderColor: c.accent } : undefined}
                  onClick={() => setSelectedId(c.id)}
                >
                  {yours && <span className={styles.yoursTag}>★ YOURS</span>}
                  <img src={c.image} alt={c.name} className={styles.cardImg} />
                  <div className={styles.cardName}>{c.name}</div>
                  <div className={styles.cardArche}>{c.archetype}</div>
                  <IntensityDots value={c.intensity} color={c.accent} />
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
