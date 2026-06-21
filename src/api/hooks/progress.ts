import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { qk } from '@/api/keys';
import type {
  AnalyticsRead,
  FreezeResult,
  HeatmapRead,
  LevelRead,
  StreakRead,
  XpSummary,
} from '@/api/types';

export function useStreak() {
  return useQuery({ queryKey: qk.streak, queryFn: () => api.get<StreakRead>('/streaks') });
}

export function useXp() {
  return useQuery({ queryKey: qk.xp, queryFn: () => api.get<XpSummary>('/xp') });
}

export function useLevel() {
  return useQuery({ queryKey: qk.level, queryFn: () => api.get<LevelRead>('/level') });
}

export function useHeatmap(range: 'weeks' | 'year' = 'weeks') {
  return useQuery({
    queryKey: qk.heatmap(range),
    queryFn: () => api.get<HeatmapRead>(`/heatmap?range=${range}`),
  });
}

export function useAnalytics(period: 'week' | 'month' | 'year' = 'week') {
  return useQuery({
    queryKey: qk.analytics(period),
    queryFn: () => api.get<AnalyticsRead>(`/analytics?period=${period}`),
  });
}

export function useFreeze() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post<FreezeResult>('/streaks/freeze'),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.streak }),
  });
}
