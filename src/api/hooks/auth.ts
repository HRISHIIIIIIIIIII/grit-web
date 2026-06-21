import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { qk } from '@/api/keys';
import type {
  LoginRequest,
  MeResponse,
  RegisterRequest,
  TokenPair,
  UpdateMeRequest,
} from '@/api/types';
import { clearSession, setTokens, useSession } from '@/auth/session';

export function useMe() {
  const authenticated = useSession((s) => s.authenticated);
  return useQuery({
    queryKey: qk.me,
    queryFn: () => api.get<MeResponse>('/me'),
    enabled: authenticated,
    staleTime: 60_000,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: LoginRequest) => api.post<TokenPair>('/auth/login', body, false),
    onSuccess: (tokens) => {
      setTokens(tokens.access_token, tokens.refresh_token);
      qc.invalidateQueries({ queryKey: qk.me });
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (body: RegisterRequest) => api.post('/auth/register', body, false),
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      try {
        await api.post('/auth/logout');
      } catch {
        /* stateless; ignore */
      }
    },
    onSuccess: () => {
      clearSession();
      qc.clear();
    },
  });
}

export function useUpdateMe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateMeRequest) => api.patch<MeResponse>('/me', body),
    onSuccess: (me) => {
      qc.setQueryData(qk.me, me);
    },
  });
}
