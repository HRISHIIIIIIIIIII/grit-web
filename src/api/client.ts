import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
} from '@/auth/session';

export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const PREFIX = '/api/v1';

export interface ApiErrorShape {
  code: string;
  message: string;
  details?: unknown;
}

export class ApiError extends Error {
  status: number;
  code: string;
  details?: unknown;
  constructor(status: number, body: ApiErrorShape) {
    super(body.message);
    this.status = status;
    this.code = body.code;
    this.details = body.details;
  }
}

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: Method;
  body?: unknown;
  auth?: boolean;
  signal?: AbortSignal;
}

async function parseError(res: Response): Promise<ApiError> {
  let body: ApiErrorShape = { code: 'error', message: res.statusText };
  try {
    const json = await res.json();
    if (json?.error) body = json.error;
  } catch {
    /* non-JSON error */
  }
  return new ApiError(res.status, body);
}

let refreshing: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  const refresh = getRefreshToken();
  if (!refresh) return false;
  if (!refreshing) {
    refreshing = (async () => {
      try {
        const res = await fetch(`${API_BASE}${PREFIX}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refresh }),
        });
        if (!res.ok) {
          clearSession();
          return false;
        }
        const data = await res.json();
        setAccessToken(data.access_token);
        return true;
      } catch {
        clearSession();
        return false;
      } finally {
        refreshing = null;
      }
    })();
  }
  return refreshing;
}

async function raw<T>(path: string, opts: RequestOptions, retry = true): Promise<T> {
  const { method = 'GET', body, auth = true, signal } = opts;
  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const token = getAccessToken();
  if (auth && token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${PREFIX}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  if (res.status === 401 && auth && retry) {
    const ok = await refreshAccessToken();
    if (ok) return raw<T>(path, opts, false);
    throw await parseError(res);
  }
  if (!res.ok) throw await parseError(res);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  get: <T>(path: string, signal?: AbortSignal) => raw<T>(path, { method: 'GET', signal }),
  post: <T>(path: string, body?: unknown, auth = true) =>
    raw<T>(path, { method: 'POST', body, auth }),
  patch: <T>(path: string, body?: unknown) => raw<T>(path, { method: 'PATCH', body }),
  del: <T>(path: string) => raw<T>(path, { method: 'DELETE' }),
};
