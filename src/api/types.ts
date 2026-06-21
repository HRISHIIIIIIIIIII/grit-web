import type { components } from './schema';

type S = components['schemas'];

export type MeResponse = S['MeResponse'];
export type UpdateMeRequest = S['UpdateMeRequest'];
export type TokenPair = S['TokenPair'];
export type LoginRequest = S['LoginRequest'];
export type RegisterRequest = S['RegisterRequest'];

export type HabitRead = S['HabitRead'];
export type HabitCreate = S['HabitCreate'];
export type HabitUpdate = S['HabitUpdate'];
export type CheckinResult = S['CheckinResult'];

export type GoalRead = S['GoalRead'];
export type GoalCreate = S['GoalCreate'];
export type GoalUpdate = S['GoalUpdate'];
export type MilestoneUpdate = S['MilestoneUpdate'];

export type RoadmapSummary = S['RoadmapSummary'];
export type RoadmapDetail = S['RoadmapDetail'];
export type RoadmapImportRequest = S['RoadmapImportRequest'];
export type RoadmapCreate = S['RoadmapCreate'];
export type PhaseRead = S['PhaseRead'];
export type TopicRead = S['TopicRead'];
export type TopicToggleResult = S['TopicToggleResult'];

export type StreakRead = S['StreakRead'];
export type FreezeResult = S['FreezeResult'];

export type LevelRead = S['LevelRead'];
export type XpSummary = S['XpSummary'];
export type HeatmapRead = S['HeatmapRead'];
export type AnalyticsRead = S['AnalyticsRead'];

export type AchievementRead = S['AchievementRead'];

export type LeaderboardRead = S['LeaderboardRead'];
export type FriendsList = S['FriendsList'];
export type ChallengeRead = S['ChallengeRead'];
export type FriendshipRead = S['FriendshipRead'];

export type NotificationRead = S['NotificationRead'];
export type ReadAllResult = S['ReadAllResult'];

export type SettingsRead = S['SettingsRead'];
export type SettingsUpdate = S['SettingsUpdate'];

export type OnboardingRequest = S['OnboardingRequest'];
export type OnboardingResponse = S['OnboardingResponse'];

export type HabitCategory = HabitRead['category'];
export type MentorTone = SettingsRead['mentor_tone'];
export type NotificationType = NotificationRead['type'];
