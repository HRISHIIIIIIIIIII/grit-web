/* Client-side ATLAS copy for the dashboard, keyed off today's completion.
   (The backend's mentor copy library powers notifications; the dashboard card
   reacts live to the ring, so it computes a line locally in the same voice.) */
export function dashboardAtlasMessage(done: number, total: number): string {
  if (total === 0) return 'No habits scheduled yet. Add one and start your streak today.';
  if (done === 0) return "A blank slate. Check off your first habit — momentum starts with one.";
  if (done >= total) return "Perfect day. Every habit done. This is exactly who you said you'd become.";
  const remaining = total - done;
  if (done / total >= 0.5)
    return `${done} down, ${remaining} to go. You're past halfway — close it out.`;
  return `${done} done so far. ${remaining} left today. Keep the chain alive.`;
}

export function greeting(name: string): string {
  const hour = new Date().getHours();
  const part = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const first = name.split(' ')[0];
  return `${part}, ${first}`;
}
