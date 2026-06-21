import type { Coach } from '@/lib/coaches';

/* Dashboard mentor line, in the selected coach's voice, reacting to today's
   completion. (The backend mentor library powers notifications; the dashboard
   card reacts live to the ring, so it composes a line from the coach's voice.) */
export function coachDashboardMessage(coach: Coach, done: number, total: number): string {
  if (total === 0) return 'No habits scheduled yet. Add one and start your streak today.';
  if (done >= total) return coach.voice.win;
  if (done === 0) return coach.voice.missed;
  const remaining = total - done;
  return `${done} done, ${remaining} to go. ${coach.voice.win}`;
}

export function greeting(name: string): string {
  const hour = new Date().getHours();
  const part = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const first = name.split(' ')[0];
  return `${part}, ${first}`;
}
