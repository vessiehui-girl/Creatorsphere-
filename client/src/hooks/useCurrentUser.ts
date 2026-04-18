import { useQuery } from '@tanstack/react-query';
import { buildApiUrl } from '@/lib/api';

export interface CurrentUser {
  id: number;
  email: string;
  name?: string | null;
}

async function fetchCurrentUser(): Promise<CurrentUser> {
  const res = await fetch(buildApiUrl('/api/auth/me'), { credentials: 'include' });
  if (res.status === 401) {
    throw new Error('Not authenticated');
  }
  if (!res.ok) {
    throw new Error('Failed to fetch user');
  }
  return res.json();
}

export function useCurrentUser() {
  return useQuery<CurrentUser, Error>({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    retry: false,
  });
}
