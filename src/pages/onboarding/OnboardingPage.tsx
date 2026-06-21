import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompleteOnboarding } from '@/api/hooks/misc';
import { useMe } from '@/api/hooks/auth';
import type { MentorTone } from '@/api/types';
import { Button, Checkbox } from '@/components/primitives';
import { ALL_CATEGORIES, categoryIcon, categoryStyle } from '@/lib/categories';
import { cx } from '@/lib/cx';
import { IDENTITY_WORDS, PACT_TEXT, SUGGESTED, type SuggestedHabit } from './suggestions';
import styles from './Onboarding.module.css';

const STEPS = ['Focus', 'Habits', 'Commitment', 'Identity', 'Pact', 'Done'];
const INTENSITY: { value: MentorTone; label: string }[] = [
  { value: 'gentle', label: 'Steady' },
  { value: 'hard', label: 'Hard' },
  { value: 'relentless', label: 'Relentless' },
];
const REMINDERS = [
  { value: 'morning', label: '🌅 Morning' },
  { value: 'midday', label: '☀️ Midday' },
  { value: 'evening', label: '🌙 Evening' },
];

const ATLAS_MSG = [
  'First — where do you want to grow? Pick the areas that matter to you.',
  'Now choose a few habits to start. Start small; consistency compounds.',
  'How hard should I push you? Set your pace and daily target.',
  'Who are you becoming? Choose the word you want to embody.',
  'Make the pact. This is the promise you make to your future self.',
  "You're in. Your streak starts now — don't break the chain.",
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const me = useMe();
  const complete = useCompleteOnboarding();
  const [step, setStep] = useState(0);
  const [focus, setFocus] = useState<string[]>([]);
  const [picked, setPicked] = useState<Record<string, SuggestedHabit>>({});
  const [daily, setDaily] = useState(3);
  const [remind, setRemind] = useState('morning');
  const [intensity, setIntensity] = useState<MentorTone>('hard');
  const [identity, setIdentity] = useState('Relentless');
  const [pact, setPact] = useState(false);

  const suggested = useMemo(() => {
    const areas = focus.length ? focus : ALL_CATEGORIES;
    const out: SuggestedHabit[] = [];
    const seen = new Set<string>();
    for (const area of areas)
      for (const h of SUGGESTED[area] ?? [])
        if (!seen.has(h.name)) {
          seen.add(h.name);
          out.push(h);
        }
    return out;
  }, [focus]);

  const toggleFocus = (c: string) =>
    setFocus((f) => (f.includes(c) ? f.filter((x) => x !== c) : [...f, c]));
  const toggleHabit = (h: SuggestedHabit) =>
    setPicked((p) => {
      const next = { ...p };
      if (next[h.name]) delete next[h.name];
      else next[h.name] = h;
      return next;
    });

  const canNext =
    (step === 0 && focus.length > 0) ||
    (step === 1 && Object.keys(picked).length > 0) ||
    (step === 4 && pact) ||
    (step !== 0 && step !== 1 && step !== 4);

  const submit = async () => {
    await complete.mutateAsync({
      focus_areas: focus as never,
      habits: Object.values(picked),
      daily_target: daily,
      reminder_slot: remind,
      intensity,
      identity_word: identity,
      pact_accepted: pact,
    });
    setStep(5);
  };

  const next = () => {
    if (step === 4) void submit();
    else setStep((s) => Math.min(5, s + 1));
  };

  return (
    <div className={styles.wrap}>
      <aside className={styles.left}>
        <div className={styles.glow} />
        <div className={styles.logo}>GRIT</div>
        <div className={styles.atlasIcon}>A</div>
        <div className={styles.atlasMsg}>{ATLAS_MSG[step]}</div>
        <div className={styles.breadcrumbs}>
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={cx(styles.crumb, i === step && styles.crumbActive, i < step && styles.crumbDone)}
            />
          ))}
        </div>
      </aside>

      <main className={styles.right}>
        <div className={styles.progress}>
          <div className={styles.progressFill} style={{ width: `${((step + 1) / 6) * 100}%` }} />
        </div>

        <div className={styles.content}>
          {step === 0 && (
            <>
              <h1 className={styles.stepTitle}>What do you want to build?</h1>
              <p className={styles.stepSub}>Pick the areas you want to focus on.</p>
              <div className={styles.cardGrid}>
                {ALL_CATEGORIES.map((c) => {
                  const cs = categoryStyle(c);
                  const active = focus.includes(c);
                  return (
                    <button
                      key={c}
                      className={cx(styles.selectCard, active && styles.selectActive)}
                      onClick={() => toggleFocus(c)}
                      style={active ? { borderColor: cs.color, background: cs.bg } : undefined}
                    >
                      <span className={styles.scIcon}>{categoryIcon(c)}</span>
                      <span className={styles.scName} style={{ flex: 1 }}>
                        {c}
                      </span>
                      <Checkbox checked={active} onChange={() => toggleFocus(c)} label={c} />
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h1 className={styles.stepTitle}>Choose your habits</h1>
              <p className={styles.stepSub}>Start with a few. You can always add more later.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {suggested.map((h) => {
                  const active = !!picked[h.name];
                  return (
                    <button
                      key={h.name}
                      className={cx(styles.selectCard, active && styles.selectActive)}
                      onClick={() => toggleHabit(h)}
                    >
                      <span className={styles.scIcon}>{categoryIcon(h.category)}</span>
                      <span style={{ flex: 1 }}>
                        <span className={styles.scName}>{h.name}</span>
                        <span className={styles.scMeta} style={{ display: 'block' }}>
                          {h.category} · +{h.xp_value} XP
                        </span>
                      </span>
                      <Checkbox checked={active} onChange={() => toggleHabit(h)} label={h.name} />
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className={styles.stepTitle}>Set your commitment</h1>
              <p className={styles.stepSub}>How hard should ATLAS push you?</p>
              <div className={styles.fieldBlock}>
                <div className={styles.fieldLabel}>Daily target · {daily} habits</div>
                <input
                  type="range"
                  min={1}
                  max={8}
                  value={daily}
                  onChange={(e) => setDaily(Number(e.target.value))}
                  className={styles.slider}
                  aria-label="Daily target"
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-400)' }}>
                  <span>1 · gentle</span>
                  <span>8 · relentless</span>
                </div>
              </div>
              <div className={styles.fieldBlock}>
                <div className={styles.fieldLabel}>Reminder time</div>
                <div className={styles.pillRow}>
                  {REMINDERS.map((r) => (
                    <button
                      key={r.value}
                      className={cx(styles.pill, remind === r.value && styles.pillActive)}
                      onClick={() => setRemind(r.value)}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.fieldBlock}>
                <div className={styles.fieldLabel}>Intensity</div>
                <div className={styles.pillRow}>
                  {INTENSITY.map((i) => (
                    <button
                      key={i.value}
                      className={cx(styles.pill, intensity === i.value && styles.pillActive)}
                      onClick={() => setIntensity(i.value)}
                    >
                      {i.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h1 className={styles.stepTitle}>Who are you becoming?</h1>
              <p className={styles.stepSub}>Choose the identity you&apos;re building toward.</p>
              <div className={styles.pillRow}>
                {IDENTITY_WORDS.map((w) => (
                  <button
                    key={w}
                    className={cx(styles.pill, identity === w && styles.pillActive)}
                    onClick={() => setIdentity(w)}
                  >
                    {w}
                  </button>
                ))}
              </div>
              <div className={styles.preview}>
                <div style={{ color: 'var(--ink-400)', fontSize: 14, marginBottom: 8 }}>
                  In 90 days, I am becoming
                </div>
                <div className={styles.previewWord}>{identity}</div>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h1 className={styles.stepTitle}>Make the pact</h1>
              <p className={styles.stepSub}>A promise to your future self.</p>
              <div className={styles.pactCard}>&ldquo;{PACT_TEXT}&rdquo;</div>
              <button
                className={cx(styles.pactAgree, pact && styles.pactAgreeOn)}
                onClick={() => setPact((v) => !v)}
              >
                <Checkbox checked={pact} onChange={setPact} label="I make the pact" size="lg" />
                <span style={{ fontWeight: 600 }}>I make the pact</span>
              </button>
            </>
          )}

          {step === 5 && (
            <div className={styles.done}>
              <div className={styles.doneCircle}>✓</div>
              <h1 className={styles.stepTitle}>You&apos;re in, {me.data?.display_name?.split(' ')[0]}</h1>
              <p className={styles.stepSub}>Your system is set. The streak starts today.</p>
              <div className={styles.doneBadges}>
                <span className={styles.doneBadge}>🔥 1-day streak</span>
                <span className={styles.doneBadge}>⭐ Level 1</span>
                <span className={styles.doneBadge}>+25 XP</span>
              </div>
              <Button size="lg" onClick={() => navigate('/')}>
                Enter GRIT
              </Button>
            </div>
          )}
        </div>

        {step < 5 && (
          <div className={styles.footer}>
            <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              Back
            </Button>
            <span className={styles.stepCount}>{step + 1} / 6</span>
            <Button onClick={next} disabled={!canNext || complete.isPending}>
              {step === 4 ? (complete.isPending ? 'Setting up…' : 'Make the pact') : 'Continue'}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
