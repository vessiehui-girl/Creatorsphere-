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

function createLoginResponse(credentials: LoginCredentials): LoginResponse {
  const user: CurrentUser = {
    id: Date.now(),
    email: credentials.email,
    name: null,
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
