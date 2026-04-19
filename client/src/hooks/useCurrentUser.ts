import { useQuery } from '@tanstack/react-query';
import { CURRENT_USER_QUERY_KEY, MOCK_AUTH_USER_STORAGE_KEY } from '@/lib/auth';

export interface CurrentUser {
  id: number;
  email: string;
  name?: string | null;
}

function fetchCurrentUser(): CurrentUser {
  if (typeof window === 'undefined') {
    throw new Error('Not authenticated');
  }

  const storedUser = window.localStorage.getItem(MOCK_AUTH_USER_STORAGE_KEY);
  if (!storedUser) {
    throw new Error('Not authenticated');
  }

  try {
    const parsed = JSON.parse(storedUser) as Partial<CurrentUser>;
    if (typeof parsed.id === 'number' && typeof parsed.email === 'string') {
      return {
        id: parsed.id,
        email: parsed.email,
        name: parsed.name ?? null,
      };
    }
  } catch {
    // ignore invalid stub data
  }

  window.localStorage.removeItem(MOCK_AUTH_USER_STORAGE_KEY);
  throw new Error('Not authenticated');
}

export function useCurrentUser() {
  return useQuery<CurrentUser, Error>({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: fetchCurrentUser,
    retry: false,
  });
}
