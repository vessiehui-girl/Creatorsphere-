import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
}

async function registerFn(credentials: RegisterCredentials) {
  return apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
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
