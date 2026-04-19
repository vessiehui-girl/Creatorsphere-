import { useQueryClient } from '@tanstack/react-query';
import type { CurrentUser } from './useCurrentUser';
import { CURRENT_USER_QUERY_KEY, MOCK_AUTH_USER_STORAGE_KEY } from '@/lib/auth';

interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
}

interface RegisterResponse {
  user: CurrentUser;
}

interface RegisterMutateOptions {
  onSuccess?: (data: RegisterResponse) => void;
}

function createRegisterResponse(credentials: RegisterCredentials): RegisterResponse {
  const user: CurrentUser = {
    id: Date.now(),
    email: credentials.email,
    name: credentials.name ?? null,
  };

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(MOCK_AUTH_USER_STORAGE_KEY, JSON.stringify(user));
  }

  return { user };
}

export function useRegister() {
  const queryClient = useQueryClient();
  const mutate = (credentials: RegisterCredentials, options?: RegisterMutateOptions) => {
    const data = createRegisterResponse(credentials);
    queryClient.setQueryData(CURRENT_USER_QUERY_KEY, data.user);
    options?.onSuccess?.(data);
  };

  return {
    mutate,
    isPending: false,
    error: null as Error | null,
  };
}
