import { useState } from 'react';
import PlannerList from '@/components/planner/PlannerList';
import ScheduleForm from '@/components/planner/ScheduleForm';
import { usePlanner, useSchedulePost } from '@/hooks/usePlanner';
import { usePosts } from '@/hooks/usePosts';

export default function Planner() {
  const { data: scheduled = [] } = usePlanner();
  const { data: posts = [] } = usePosts();
  const schedulePost = useSchedulePost();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Planner</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
        >
          {showForm ? 'Hide' : '+ Schedule'}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 bg-gray-800 border border-gray-700 rounded-xl p-4">
          <ScheduleForm
            posts={posts}
            onSchedule={(data) => {
              schedulePost.mutate(data, { onSuccess: () => setShowForm(false) });
            }}
            isLoading={schedulePost.isPending}
          />
        </div>
      )}

      <PlannerList items={scheduled} />
    </div>
  );
}
