import { format } from 'date-fns';

export interface ScheduledPostItem {
  id: number;
  platform: string | null;
  scheduledFor: string | null;
  status: string | null;
  postId: number | null;
}

interface PlannerListProps {
  items: ScheduledPostItem[];
}

export default function PlannerList({ items }: PlannerListProps) {
  if (items.length === 0) {
    return <p className="text-gray-500 text-center py-8">No scheduled posts yet.</p>;
  }

  const grouped: Record<string, ScheduledPostItem[]> = {};
  for (const item of items) {
    const day = item.scheduledFor ? format(new Date(item.scheduledFor), 'PPP') : 'Unknown date';
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(item);
  }

  return (
    <div className="flex flex-col gap-6">
      {Object.entries(grouped).map(([day, dayItems]) => (
        <div key={day}>
          <h3 className="text-gray-400 text-sm font-semibold mb-2">{day}</h3>
          <div className="flex flex-col gap-2">
            {dayItems.map((item) => (
              <div
                key={item.id}
                className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 flex justify-between items-center"
              >
                <div>
                  <p className="text-white font-medium">{item.platform}</p>
                  <p className="text-gray-400 text-sm">
                    {item.scheduledFor ? format(new Date(item.scheduledFor), 'p') : ''}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    item.status === 'pending'
                      ? 'bg-yellow-900/40 text-yellow-400'
                      : 'bg-green-900/40 text-green-400'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
