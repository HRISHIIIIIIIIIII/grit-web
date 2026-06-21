import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { qk } from '@/api/keys';
import type { CheckinResult, HabitCreate, HabitRead, HabitUpdate } from '@/api/types';

export function useHabits(includeArchived = false) {
  return useQuery({
    queryKey: includeArchived ? qk.habitsArchived : qk.habits,
    queryFn: () =>
      api.get<HabitRead[]>(`/habits${includeArchived ? '?include_archived=true' : ''}`),
  });
}

function invalidateProgress(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: qk.streak });
  qc.invalidateQueries({ queryKey: qk.xp });
  qc.invalidateQueries({ queryKey: qk.level });
  qc.invalidateQueries({ queryKey: qk.me });
  qc.invalidateQueries({ queryKey: ['heatmap'] });
  qc.invalidateQueries({ queryKey: ['analytics'] });
}

export function useCreateHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: HabitCreate) => api.post<HabitRead>('/habits', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.habits }),
  });
}

export function useUpdateHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: HabitUpdate }) =>
      api.patch<HabitRead>(`/habits/${id}`, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.habits });
      qc.invalidateQueries({ queryKey: qk.habitsArchived });
    },
  });
}

export function useDeleteHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.del(`/habits/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.habits });
      qc.invalidateQueries({ queryKey: qk.habitsArchived });
    },
  });
}

/* Optimistic check-in: flip checked_in_today + bump current_streak immediately. */
export function useCheckin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.post<CheckinResult>(`/habits/${id}/checkin`),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: qk.habits });
      const prev = qc.getQueryData<HabitRead[]>(qk.habits);
      qc.setQueryData<HabitRead[]>(qk.habits, (old) =>
        old?.map((h) =>
          h.id === id ? { ...h, checked_in_today: true, current_streak: h.current_streak + 1 } : h,
        ),
      );
      return { prev };
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(qk.habits, ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: qk.habits });
      invalidateProgress(qc);
    },
  });
}

export function useUndoCheckin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.del(`/habits/${id}/checkin`),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: qk.habits });
      const prev = qc.getQueryData<HabitRead[]>(qk.habits);
      qc.setQueryData<HabitRead[]>(qk.habits, (old) =>
        old?.map((h) =>
          h.id === id
            ? { ...h, checked_in_today: false, current_streak: Math.max(0, h.current_streak - 1) }
            : h,
        ),
      );
      return { prev };
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(qk.habits, ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: qk.habits });
      invalidateProgress(qc);
    },
  });
}

export function useArchiveHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, archived }: { id: number; archived: boolean }) =>
      api.post<HabitRead>(`/habits/${id}/${archived ? 'archive' : 'restore'}`),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: qk.habits });
      qc.invalidateQueries({ queryKey: qk.habitsArchived });
    },
  });
}
