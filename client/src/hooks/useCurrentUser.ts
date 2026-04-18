import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

export interface CurrentUser {
  id: number;
  email: string;
  name?: string | null;
}

async function fetchCurrentUser(): Promise<CurrentUser> {
  const currentUser = await apiFetch<CurrentUser>('/api/auth/me');
  if (!currentUser) {
    throw new Error('Not authenticated');
  }
  return currentUser;
}

export function useCurrentUser() {
  return useQuery<CurrentUser, Error>({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    retry: false,
  });
}
