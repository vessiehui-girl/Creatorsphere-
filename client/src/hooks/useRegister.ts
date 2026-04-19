import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CurrentUser } from './useCurrentUser';

interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
}

interface RegisterResponse {
  user: CurrentUser;
}

const MOCK_AUTH_USER_STORAGE_KEY = 'mockAuthUser';

async function registerFn(credentials: RegisterCredentials) {
  const user: CurrentUser = {
    id: Date.now(),
    email: credentials.email,
    name: credentials.name ?? null,
  };

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(MOCK_AUTH_USER_STORAGE_KEY, JSON.stringify(user));
  }

  return Promise.resolve<RegisterResponse>({ user });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerFn,
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data.user);

      if (typeof window !== 'undefined') {
        window.setTimeout(() => {
          if (window.location.pathname !== '/onboarding/platforms') {
            window.history.pushState({}, '', '/onboarding/platforms');
            window.dispatchEvent(new PopStateEvent('popstate'));
          }
        }, 0);
      }
    },
  });
}
