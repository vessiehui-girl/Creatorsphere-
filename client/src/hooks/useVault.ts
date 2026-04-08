import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

export function useVault() {
  return useQuery({
    queryKey: ['vault'],
    queryFn: () => apiFetch<any[]>('/api/vault'),
  });
}

export function useAddVaultItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { type?: string; title: string; content?: string; fileUrl?: string }) =>
      apiFetch('/api/vault', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault'] });
    },
  });
}
