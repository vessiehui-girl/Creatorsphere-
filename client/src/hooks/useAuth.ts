import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface User {
  id: number;
  email: string;
}

const fetchCurrentUser = async (): Promise<User | null> => {
  const response = await fetch('/api/auth/me');
  if (response.status === 401) return null;
  if (!response.ok) throw new Error('Error fetching current user');
  return response.json();
};

const loginFn = async ({ email, password }: { email: string; password: string }): Promise<User> => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.message ?? 'Invalid credentials');
  }
  return response.json();
};

const registerFn = async ({ email, password }: { email: string; password: string }): Promise<User> => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.message ?? 'Error registering');
  }
  return response.json();
};

const logoutFn = async (): Promise<void> => {
  await fetch('/api/auth/logout', { method: 'POST' });
};

const useAuth = () => {
  const queryClient = useQueryClient();

  const { data: currentUser, isPending: isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
  });

  const loginMutation = useMutation({
    mutationFn: loginFn,
    onSuccess: (user) => {
      queryClient.setQueryData(['currentUser'], user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerFn,
    onSuccess: (user) => {
      queryClient.setQueryData(['currentUser'], user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutFn,
    onSuccess: () => {
      queryClient.setQueryData(['currentUser'], null);
    },
  });

  return {
    currentUser,
    isLoading,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
  };
};

export default useAuth;