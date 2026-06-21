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
import { Placeholder } from '@/components/Placeholder';

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
        <Placeholder title="Onboarding" />
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
      { path: 'streaks', element: <Placeholder title="Streaks" /> },
      { path: 'achievements', element: <Placeholder title="Achievements" /> },
      { path: 'analytics', element: <Placeholder title="Analytics" /> },
      { path: 'community', element: <Placeholder title="Community" /> },
      { path: 'profile', element: <Placeholder title="Profile" /> },
      { path: 'notifications', element: <Placeholder title="Notifications" /> },
      { path: 'settings', element: <Placeholder title="Settings" /> },
    ],
  },
  { path: '*', element: <Placeholder title="Not found" /> },
]);
