import { useMutation, useQueryClient } from '@tanstack/react-query';

interface LoginCredentials {
  email: string;
  password: string;
}

async function loginFn(credentials: LoginCredentials) {
  const res = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Login failed');
  }
  return res.json().catch(() => null);
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
