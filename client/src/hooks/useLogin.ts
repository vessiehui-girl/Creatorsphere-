import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { CurrentUser } from './useCurrentUser';

interface LoginCredentials {
  email: string;
  password: string;
}

async function loginFn(credentials: LoginCredentials) {
  const data = await apiFetch<CurrentUser | { user: CurrentUser }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  if (data && typeof data === 'object' && 'user' in data) {
    return data.user;
  }
  return data;
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
