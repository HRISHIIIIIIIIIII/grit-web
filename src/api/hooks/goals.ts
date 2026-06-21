import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { qk } from '@/api/keys';
import type { GoalCreate, GoalRead, GoalUpdate } from '@/api/types';

export function useGoals() {
  return useQuery({ queryKey: qk.goals, queryFn: () => api.get<GoalRead[]>('/goals') });
}

export function useGoal(id: number) {
  return useQuery({
    queryKey: qk.goal(id),
    queryFn: () => api.get<GoalRead>(`/goals/${id}`),
    enabled: Number.isFinite(id),
  });
}

export function useCreateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: GoalCreate) => api.post<GoalRead>('/goals', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.goals }),
  });
}

export function useUpdateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: GoalUpdate }) =>
      api.patch<GoalRead>(`/goals/${id}`, body),
    onSuccess: (g) => {
      qc.invalidateQueries({ queryKey: qk.goals });
      qc.invalidateQueries({ queryKey: qk.goal(g.id) });
    },
  });
}

export function useDeleteGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.del(`/goals/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.goals }),
  });
}

/* Optimistic milestone toggle: flip done + recompute progress on the cached goal. */
export function useToggleMilestone(goalId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ milestoneId, done }: { milestoneId: number; done: boolean }) =>
      api.patch<GoalRead>(`/goals/${goalId}/milestones/${milestoneId}`, { done }),
    onMutate: async ({ milestoneId, done }) => {
      await qc.cancelQueries({ queryKey: qk.goal(goalId) });
      const prev = qc.getQueryData<GoalRead>(qk.goal(goalId));
      if (prev) {
        const milestones = prev.milestones.map((m) =>
          m.id === milestoneId ? { ...m, done } : m,
        );
        const doneCount = milestones.filter((m) => m.done).length;
        qc.setQueryData<GoalRead>(qk.goal(goalId), {
          ...prev,
          milestones,
          done_milestones: doneCount,
          progress_pct: prev.total_milestones
            ? Math.floor((doneCount * 100) / prev.total_milestones)
            : 0,
        });
      }
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(qk.goal(goalId), ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: qk.goal(goalId) });
      qc.invalidateQueries({ queryKey: qk.goals });
      qc.invalidateQueries({ queryKey: qk.me });
      qc.invalidateQueries({ queryKey: qk.xp });
    },
  });
}
