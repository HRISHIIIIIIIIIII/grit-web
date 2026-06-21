import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useMe } from '@/api/hooks/auth';
import { useSession } from '@/auth/session';
import { FullScreenLoader } from '@/components/FullScreenLoader';

/* Gate for the app shell: must be authenticated AND onboarded. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const authenticated = useSession((s) => s.authenticated);
  const location = useLocation();
  const me = useMe();

  if (!authenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (me.isLoading) return <FullScreenLoader />;
  if (me.isError) return <Navigate to="/login" replace />;
  if (me.data && !me.data.onboarding_completed) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

/* Gate for onboarding: authenticated, but redirect home if already onboarded. */
export function RequireOnboarding({ children }: { children: ReactNode }) {
  const authenticated = useSession((s) => s.authenticated);
  const me = useMe();
  if (!authenticated) return <Navigate to="/login" replace />;
  if (me.isLoading) return <FullScreenLoader />;
  if (me.data?.onboarding_completed) return <Navigate to="/" replace />;
  return <>{children}</>;
}

/* Gate for /login and /register: redirect into the app if already signed in. */
export function RedirectIfAuthed({ children }: { children: ReactNode }) {
  const authenticated = useSession((s) => s.authenticated);
  const me = useMe();
  if (authenticated && me.data) {
    return <Navigate to={me.data.onboarding_completed ? '/' : '/onboarding'} replace />;
  }
  return <>{children}</>;
}
