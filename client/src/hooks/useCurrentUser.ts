import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

export interface CurrentUser {
  id: number;
  email: string;
  name?: string | null;
}

async function fetchCurrentUser(): Promise<CurrentUser> {
  return apiFetch<CurrentUser>('/api/auth/me');
}

export function useCurrentUser() {
  return useQuery<CurrentUser, Error>({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    retry: false,
  });
}
