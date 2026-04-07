import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

export function useAnalytics() {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: () => apiFetch<any[]>('/api/analytics/summary'),
  });
}
