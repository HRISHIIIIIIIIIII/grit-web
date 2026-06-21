import { useState } from 'react';
import { useChallenges, useFriends, useLeaderboard } from '@/api/hooks/misc';
import { Avatar, Badge, Card, ProgressBar, SegmentedControl, Skeleton } from '@/components/primitives';
import { PageHeader } from '@/components/PageHeader';
import styles from './Community.module.css';

type Scope = 'league' | 'friends' | 'global';

const MEDALS = ['🥇', '🥈', '🥉'];

export function CommunityPage() {
  const [scope, setScope] = useState<Scope>('league');
  const leaderboard = useLeaderboard(scope);
  const challenges = useChallenges();
  const friends = useFriends();

  return (
    <div>
      <PageHeader title="Community" subtitle="COMPETE & STAY ACCOUNTABLE" />

      <Card dark style={{ marginBottom: 16 }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 38 }}>🏆</span>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#fff' }}>
              {scope === 'league' ? 'Emerald League' : scope === 'friends' ? 'Your friends' : 'Global board'}
            </div>
            <div style={{ color: 'var(--ink-400)' }} className="mono">
              {leaderboard.data?.my_rank ? `You're #${leaderboard.data.my_rank}` : 'Climb the ranks'}
            </div>
          </div>
        </div>
      </Card>

      <div style={{ marginBottom: 16 }}>
        <SegmentedControl
          value={scope}
          onChange={setScope}
          ariaLabel="Leaderboard scope"
          options={[
            { value: 'league', label: 'League' },
            { value: 'friends', label: 'Friends' },
            { value: 'global', label: 'Global' },
          ]}
        />
      </div>

      <div className={styles.split}>
        <Card pad="none">
          {leaderboard.isLoading ? (
            <div style={{ padding: 20 }}>
              <Skeleton height={300} />
            </div>
          ) : (leaderboard.data?.entries ?? []).length === 0 ? (
            <div style={{ padding: 28, color: 'var(--ink-500)' }}>No one here yet.</div>
          ) : (
            leaderboard.data!.entries.map((e) => (
              <div key={e.user_id} className={styles.row} data-me={e.is_me || undefined}>
                <span className={styles.rank}>{e.rank <= 3 ? MEDALS[e.rank - 1] : `#${e.rank}`}</span>
                <Avatar name={e.display_name} size={36} />
                <div className={styles.rowMeta}>
                  <div className={styles.rowName}>
                    {e.display_name}
                    {e.is_me && <span className={styles.youTag}>YOU</span>}
                  </div>
                  <div className={styles.rowSub}>Level {e.level}</div>
                </div>
                <span className={styles.rowXp}>{e.xp.toLocaleString()} XP</span>
              </div>
            ))
          )}
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <div className={styles.colTitle}>Active challenges</div>
            {challenges.isLoading ? (
              <Skeleton height={100} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {(challenges.data ?? []).map((c) => (
                  <div key={c.code}>
                    <div className={styles.challengeTop}>
                      <span className={styles.challengeName}>{c.name}</span>
                      <span className={styles.challengeCount}>
                        {c.progress}/{c.target}
                      </span>
                    </div>
                    <ProgressBar value={(c.progress / c.target) * 100} height={7} />
                    <div className={styles.challengeDesc}>{c.description}</div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <div className={styles.colTitle}>Your circle</div>
            {friends.isLoading ? (
              <Skeleton height={80} />
            ) : (friends.data?.friends ?? []).length === 0 ? (
              <p style={{ color: 'var(--ink-500)', fontSize: 14 }}>No friends yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {friends.data!.friends.map((f) => (
                  <div key={f.user_id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar name={f.display_name} size={34} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{f.display_name}</div>
                      <div className="mono" style={{ fontSize: 11, color: 'var(--ink-400)' }}>
                        Lv {f.level}
                      </div>
                    </div>
                    <Badge tone="active">{f.xp_total.toLocaleString()} XP</Badge>
                  </div>
                ))}
              </div>
            )}
            {(friends.data?.incoming_requests ?? []).length > 0 && (
              <div className={styles.requests}>
                {friends.data!.incoming_requests.length} pending request(s)
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
