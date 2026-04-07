import { useMutation, useQueryClient } from '@tanstack/react-query';

interface RegisterCredentials {
  email: string;
  password: string;
}

async function registerFn(credentials: RegisterCredentials) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Registration failed');
  }
  return res.json().catch(() => null);
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
}
