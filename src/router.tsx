import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/app/AppShell';
import { RedirectIfAuthed, RequireAuth, RequireOnboarding } from '@/auth/guards';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
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
      { index: true, element: <Placeholder title="Dashboard" /> },
      { path: 'habits', element: <Placeholder title="Habits" /> },
      { path: 'goals', element: <Placeholder title="Goals" /> },
      { path: 'goals/:id', element: <Placeholder title="Goal" /> },
      { path: 'roadmaps', element: <Placeholder title="Roadmaps" /> },
      { path: 'roadmaps/import', element: <Placeholder title="Import roadmap" /> },
      { path: 'roadmaps/:id', element: <Placeholder title="Roadmap" /> },
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
