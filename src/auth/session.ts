import { create } from 'zustand';

/* Access token lives in memory only; the refresh token persists in localStorage
   so sessions survive reloads. The fetch client reads getAccessToken() and
   refreshes transparently on 401. */

const REFRESH_KEY = 'grit.refresh';

let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY);
}

interface SessionState {
  authenticated: boolean;
  setAuthenticated: (value: boolean) => void;
}

export const useSession = create<SessionState>((set) => ({
  authenticated: !!localStorage.getItem(REFRESH_KEY),
  setAuthenticated: (value) => set({ authenticated: value }),
}));

export function setTokens(access: string, refresh: string): void {
  accessToken = access;
  localStorage.setItem(REFRESH_KEY, refresh);
  useSession.getState().setAuthenticated(true);
}

export function setAccessToken(access: string): void {
  accessToken = access;
}

export function clearSession(): void {
  accessToken = null;
  localStorage.removeItem(REFRESH_KEY);
  useSession.getState().setAuthenticated(false);
}
