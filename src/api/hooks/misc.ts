import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { qk } from '@/api/keys';
import type {
  AchievementRead,
  ChallengeRead,
  FriendsList,
  FriendshipRead,
  LeaderboardRead,
  NotificationRead,
  OnboardingRequest,
  OnboardingResponse,
  ReadAllResult,
  SettingsRead,
  SettingsUpdate,
} from '@/api/types';

/* Achievements */
export function useAchievements() {
  return useQuery({
    queryKey: qk.achievements,
    queryFn: () => api.get<AchievementRead[]>('/achievements'),
  });
}

/* Community */
export function useLeaderboard(scope: 'league' | 'friends' | 'global') {
  return useQuery({
    queryKey: qk.leaderboard(scope),
    queryFn: () => api.get<LeaderboardRead>(`/leaderboard?scope=${scope}`),
  });
}

export function useFriends() {
  return useQuery({ queryKey: qk.friends, queryFn: () => api.get<FriendsList>('/friends') });
}

export function useChallenges() {
  return useQuery({
    queryKey: qk.challenges,
    queryFn: () => api.get<ChallengeRead[]>('/challenges'),
  });
}

export function useAddFriend() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (email: string) => api.post<FriendshipRead>('/friends', { email }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.friends }),
  });
}

export function useRespondFriend() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, accept }: { id: number; accept: boolean }) =>
      api.post<FriendsList>(`/friends/${id}/respond`, { accept }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.friends });
      qc.invalidateQueries({ queryKey: ['leaderboard'] });
    },
  });
}

/* Notifications */
export function useNotifications() {
  return useQuery({
    queryKey: qk.notifications,
    queryFn: () => api.get<NotificationRead[]>('/notifications'),
  });
}

export function useMarkRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.post<NotificationRead>(`/notifications/${id}/read`),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: qk.notifications });
      const prev = qc.getQueryData<NotificationRead[]>(qk.notifications);
      qc.setQueryData<NotificationRead[]>(qk.notifications, (old) =>
        old?.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)),
      );
      return { prev };
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(qk.notifications, ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: qk.notifications }),
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post<ReadAllResult>('/notifications/read-all'),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.notifications }),
  });
}

/* Settings */
export function useSettings() {
  return useQuery({ queryKey: qk.settings, queryFn: () => api.get<SettingsRead>('/settings') });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: SettingsUpdate) => api.patch<SettingsRead>('/settings', body),
    onMutate: async (body) => {
      await qc.cancelQueries({ queryKey: qk.settings });
      const prev = qc.getQueryData<SettingsRead>(qk.settings);
      if (prev) {
        // Merge only the keys actually provided (drop undefined) for the optimistic view.
        const patch = Object.fromEntries(
          Object.entries(body).filter(([, v]) => v !== undefined),
        );
        qc.setQueryData<SettingsRead>(qk.settings, { ...prev, ...patch });
      }
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(qk.settings, ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: qk.settings }),
  });
}

/* Onboarding */
export function useCompleteOnboarding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: OnboardingRequest) => api.post<OnboardingResponse>('/onboarding', body),
    // NOTE: we deliberately do NOT update the `me` cache here — that would flip
    // the onboarding guard and skip the celebratory "done" screen. The page
    // applies res.user to the cache when the user taps "Enter GRIT".
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.habits });
      qc.invalidateQueries({ queryKey: qk.settings });
    },
  });
}
