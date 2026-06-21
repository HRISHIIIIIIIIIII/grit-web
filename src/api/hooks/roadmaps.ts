import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { qk } from '@/api/keys';
import type {
  RoadmapCreate,
  RoadmapDetail,
  RoadmapImportRequest,
  RoadmapSummary,
  TopicToggleResult,
} from '@/api/types';

export function useRoadmaps() {
  return useQuery({ queryKey: qk.roadmaps, queryFn: () => api.get<RoadmapSummary[]>('/roadmaps') });
}

export function useRoadmap(id: number) {
  return useQuery({
    queryKey: qk.roadmap(id),
    queryFn: () => api.get<RoadmapDetail>(`/roadmaps/${id}`),
    enabled: Number.isFinite(id),
  });
}

export function useImportRoadmap() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: RoadmapImportRequest) => api.post<RoadmapDetail>('/roadmaps/import', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.roadmaps }),
  });
}

export function useCreateRoadmap() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: RoadmapCreate) => api.post<RoadmapDetail>('/roadmaps', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.roadmaps }),
  });
}

/* Optimistic topic toggle: flip done on the cached roadmap detail.
   Returns the server result so the caller can fire the DSA toast. */
export function useToggleTopic(roadmapId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ topicId, done }: { topicId: number; done: boolean }) =>
      api.patch<TopicToggleResult>(`/roadmaps/${roadmapId}/topics/${topicId}`, { done }),
    onMutate: async ({ topicId, done }) => {
      await qc.cancelQueries({ queryKey: qk.roadmap(roadmapId) });
      const prev = qc.getQueryData<RoadmapDetail>(qk.roadmap(roadmapId));
      if (prev) {
        qc.setQueryData<RoadmapDetail>(qk.roadmap(roadmapId), {
          ...prev,
          phases: prev.phases.map((p) => ({
            ...p,
            topics: p.topics.map((t) => (t.id === topicId ? { ...t, done } : t)),
          })),
        });
      }
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(qk.roadmap(roadmapId), ctx.prev);
    },
    onSettled: (result) => {
      qc.invalidateQueries({ queryKey: qk.roadmap(roadmapId) });
      qc.invalidateQueries({ queryKey: qk.roadmaps });
      qc.invalidateQueries({ queryKey: qk.xp });
      qc.invalidateQueries({ queryKey: qk.me });
      // DSA credit may have created today's check-in → refresh habits + streak.
      if (result?.dsa_habit_credited) {
        qc.invalidateQueries({ queryKey: qk.habits });
        qc.invalidateQueries({ queryKey: qk.streak });
      }
    },
  });
}
