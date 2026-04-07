import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

export function usePlanner() {
  return useQuery({
    queryKey: ['planner'],
    queryFn: () => apiFetch<any[]>('/api/planner'),
  });
}

export function useSchedulePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { postId: number; platform: string; scheduledFor: string }) =>
      apiFetch('/api/planner/schedule', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planner'] });
    },
  });
}
