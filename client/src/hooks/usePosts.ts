import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => apiFetch<any[]>('/api/posts'),
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { caption?: string; mediaUrl?: string; status?: string }) =>
      apiFetch('/api/posts', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
