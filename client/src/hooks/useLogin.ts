import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { CurrentUser } from './useCurrentUser';

interface LoginCredentials {
  email: string;
  password: string;
}

const isCurrentUser = (value: unknown): value is CurrentUser => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<CurrentUser>;
  return typeof candidate.id === 'number' && typeof candidate.email === 'string';
};

async function loginFn(credentials: LoginCredentials) {
  const data = await apiFetch<CurrentUser | { user: CurrentUser }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  if (!data) {
    throw new Error('Login failed: server returned an empty response');
  }
  if (isCurrentUser(data)) {
    return data;
  }
  if (typeof data === 'object' && 'user' in data && isCurrentUser(data.user)) {
    return data.user;
  }
  throw new Error('Login failed: unexpected response format');
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
}
