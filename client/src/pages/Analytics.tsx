import AnalyticsCard from '@/components/analytics/AnalyticsCard';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function Analytics() {
  const { data: stats = [], isLoading } = useAnalytics();

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-white mb-6">Analytics</h1>
      {isLoading ? (
        <p className="text-gray-400 text-center py-8">Loading…</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {stats.map((stat: any) => (
            <AnalyticsCard
              key={stat.platform}
              platform={stat.platform}
              views={stat.views ?? 0}
              likes={stat.likes ?? 0}
              comments={stat.comments ?? 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
