import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

export function usePlatforms() {
  return useQuery({
    queryKey: ['platforms'],
    queryFn: () => apiFetch<any[]>('/api/platforms'),
  });
}

export function useConnectPlatforms() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (platforms: string[]) =>
      apiFetch('/api/platforms/connect', {
        method: 'POST',
        body: JSON.stringify({ platforms }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platforms'] });
    },
  });
}
