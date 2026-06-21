import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMe } from '@/api/hooks/auth';
import { useUpdateMe } from '@/api/hooks/auth';
import { useSettings, useUpdateSettings } from '@/api/hooks/misc';
import { useLogout } from '@/api/hooks/auth';
import { Avatar, Button, Card, Icon, Input, SegmentedControl, Toggle } from '@/components/primitives';
import { PageHeader } from '@/components/PageHeader';
import { ACCENTS, accentKeyFromHex, applyAccent } from '@/lib/theme';
import { getCoach } from '@/lib/coaches';
import { cx } from '@/lib/cx';
import styles from './Settings.module.css';

const TONES = [
  { value: 'gentle', label: 'Gentle', note: 'Supportive nudges' },
  { value: 'hard', label: 'Hard', note: 'Pushes you daily' },
  { value: 'relentless', label: 'Relentless', note: 'No excuses' },
] as const;

export function SettingsPage() {
  const me = useMe();
  const settings = useSettings();
  const updateSettings = useUpdateSettings();
  const updateMe = useUpdateMe();
  const logout = useLogout();
  const [saved, setSaved] = useState(false);
  const savedTimer = useRef<number>();

  const [name, setName] = useState('');
  useEffect(() => {
    if (me.data) setName(me.data.display_name);
  }, [me.data]);

  const flashSaved = () => {
    setSaved(true);
    window.clearTimeout(savedTimer.current);
    savedTimer.current = window.setTimeout(() => setSaved(false), 1800);
  };

  const s = settings.data;
  const accentKey = accentKeyFromHex(s?.accent_color);
  const coach = getCoach(s?.coach);

  const setAccent = (hex: string) => {
    applyAccent(accentKeyFromHex(hex)); // live re-theme immediately
    updateSettings.mutate({ accent_color: hex });
    flashSaved();
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="ACCOUNT & PREFERENCES"
        actions={saved ? <span className={styles.saved}>✓ Saved</span> : undefined}
      />

      <div className={styles.stack}>
        <Card>
          <div className={styles.sectionTitle}>Account</div>
          <div style={{ display: 'flex', gap: 18, alignItems: 'center', marginBottom: 16 }}>
            <Avatar name={me.data?.display_name ?? 'You'} size={64} />
            <div style={{ flex: 1 }}>
              <Input
                label="Display name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => {
                  if (name.trim() && name !== me.data?.display_name) {
                    updateMe.mutate({ display_name: name.trim() });
                    flashSaved();
                  }
                }}
              />
            </div>
          </div>
          <Input label="Email" value={me.data?.email ?? ''} disabled />
        </Card>

        <Card>
          <div className={styles.sectionTitle}>Appearance</div>
          <div className={styles.fieldLabel}>Accent color</div>
          <div style={{ display: 'flex', gap: 12 }}>
            {ACCENTS.map((acc) => (
              <button
                key={acc.key}
                type="button"
                aria-label={acc.label}
                aria-pressed={accentKey === acc.key}
                className={cx(styles.swatch, accentKey === acc.key && styles.swatchActive)}
                style={{ background: acc.hex, boxShadow: accentKey === acc.key ? `0 0 0 3px ${acc.hex}40` : undefined }}
                onClick={() => setAccent(acc.hex)}
              />
            ))}
          </div>
        </Card>

        <Card>
          <div className={styles.sectionTitle}>{coach.name} · your mentor</div>
          <Link to="/coaches" className={styles.coachCard}>
            <img src={coach.image} alt={coach.name} className={styles.coachImg} />
            <div style={{ flex: 1 }}>
              <div className={styles.coachName}>
                {coach.name} · {coach.archetype}
              </div>
              <div className={styles.coachHint}>Tap to switch coach — 5 to choose from</div>
            </div>
            <Icon name="chevronRight" size={18} style={{ color: 'var(--ink-300)' }} />
          </Link>
          <div className={styles.fieldLabel} style={{ marginTop: 18 }}>
            Tone
          </div>
          <div className={styles.toneGrid}>
            {TONES.map((t) => (
              <button
                key={t.value}
                type="button"
                className={cx(styles.toneTile, s?.mentor_tone === t.value && styles.toneActive)}
                onClick={() => {
                  updateSettings.mutate({ mentor_tone: t.value });
                  flashSaved();
                }}
              >
                <div className={styles.toneName}>{t.label}</div>
                <div className={styles.toneNote}>{t.note}</div>
              </button>
            ))}
          </div>
          <label className={styles.toggleRow} style={{ marginTop: 18 }}>
            <span>Sound effects</span>
            <Toggle
              checked={Boolean(s?.sound_enabled)}
              onChange={(v) => {
                updateSettings.mutate({ sound_enabled: v });
                flashSaved();
              }}
              label="Sound effects"
            />
          </label>
        </Card>

        <Card>
          <div className={styles.sectionTitle}>Data & privacy</div>
          <label className={styles.toggleRow}>
            <div>
              <div style={{ fontWeight: 600 }}>Public on leaderboards</div>
              <div style={{ fontSize: 12, color: 'var(--ink-400)' }}>
                Show your name and XP on global boards.
              </div>
            </div>
            <Toggle
              checked={Boolean(s?.public_on_leaderboards)}
              onChange={(v) => {
                updateSettings.mutate({ public_on_leaderboards: v });
                flashSaved();
              }}
              label="Public on leaderboards"
            />
          </label>
          <div style={{ marginTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <SegmentedControl
              value={s?.reminder_slot ?? 'morning'}
              onChange={(slot) => {
                updateSettings.mutate({ reminder_slot: slot });
                flashSaved();
              }}
              ariaLabel="Daily reminder time"
              options={[
                { value: 'morning', label: '🌅 Morning' },
                { value: 'midday', label: '☀️ Midday' },
                { value: 'evening', label: '🌙 Evening' },
              ]}
            />
            <Button variant="danger" onClick={() => logout.mutate()}>
              Sign out
            </Button>
          </div>
        </Card>

        <div className={styles.version}>GRIT · v0.1.0</div>
      </div>
    </div>
  );
}
