import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/app/AppShell';
import { RedirectIfAuthed, RequireAuth, RequireOnboarding } from '@/auth/guards';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { HabitsPage } from '@/pages/habits/HabitsPage';
import { RoadmapsPage } from '@/pages/roadmaps/RoadmapsPage';
import { RoadmapDetailPage } from '@/pages/roadmaps/RoadmapDetailPage';
import { RoadmapImportPage } from '@/pages/roadmaps/RoadmapImportPage';
import { GoalsPage } from '@/pages/goals/GoalsPage';
import { GoalDetailPage } from '@/pages/goals/GoalDetailPage';
import { StreaksPage } from '@/pages/streaks/StreaksPage';
import { AchievementsPage } from '@/pages/achievements/AchievementsPage';
import { AnalyticsPage } from '@/pages/analytics/AnalyticsPage';
import { CommunityPage } from '@/pages/community/CommunityPage';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { NotificationsPage } from '@/pages/notifications/NotificationsPage';
import { SettingsPage } from '@/pages/settings/SettingsPage';
import { OnboardingPage } from '@/pages/onboarding/OnboardingPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <RedirectIfAuthed>
        <LoginPage />
      </RedirectIfAuthed>
    ),
  },
  {
    path: '/register',
    element: (
      <RedirectIfAuthed>
        <RegisterPage />
      </RedirectIfAuthed>
    ),
  },
  {
    path: '/onboarding',
    element: (
      <RequireOnboarding>
        <OnboardingPage />
      </RequireOnboarding>
    ),
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'habits', element: <HabitsPage /> },
      { path: 'goals', element: <GoalsPage /> },
      { path: 'goals/:id', element: <GoalDetailPage /> },
      { path: 'roadmaps', element: <RoadmapsPage /> },
      { path: 'roadmaps/import', element: <RoadmapImportPage /> },
      { path: 'roadmaps/:id', element: <RoadmapDetailPage /> },
      { path: 'streaks', element: <StreaksPage /> },
      { path: 'achievements', element: <AchievementsPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'community', element: <CommunityPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  {
    path: '*',
    element: (
      <div style={{ display: 'grid', placeItems: 'center', height: '100vh', gap: 8 }}>
        <h1 style={{ fontSize: 40 }}>404</h1>
        <a href="/" style={{ color: 'var(--accent-strong)', fontWeight: 600 }}>
          Back to GRIT
        </a>
      </div>
    ),
  },
]);
