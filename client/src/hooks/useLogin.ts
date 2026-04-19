import { useQueryClient } from '@tanstack/react-query';
import type { CurrentUser } from './useCurrentUser';
import { CURRENT_USER_QUERY_KEY, MOCK_AUTH_USER_STORAGE_KEY } from '@/lib/auth';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: CurrentUser;
}

interface LoginMutateOptions {
  onSuccess?: (data: LoginResponse) => void;
}

function buildMockUserId(): number {
  return Number(`${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);
}

function readStoredUser(): CurrentUser | null {
  if (typeof window === 'undefined') return null;
  const storedUser = window.localStorage.getItem(MOCK_AUTH_USER_STORAGE_KEY);
  if (!storedUser) return null;

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

  return null;
}

function createLoginResponse(credentials: LoginCredentials): LoginResponse {
  const existingUser = readStoredUser();
  const user: CurrentUser = {
    id: existingUser?.id ?? buildMockUserId(),
    email: credentials.email,
    name: existingUser?.name ?? null,
  };

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(MOCK_AUTH_USER_STORAGE_KEY, JSON.stringify(user));
  }

  return { user };
}

export function useLogin() {
  const queryClient = useQueryClient();
  const mutate = (credentials: LoginCredentials, options?: LoginMutateOptions) => {
    const data = createLoginResponse(credentials);
    queryClient.setQueryData(CURRENT_USER_QUERY_KEY, data.user);
    options?.onSuccess?.(data);
  };

  return {
    mutate,
    isPending: false,
    error: null as Error | null,
  };
}
