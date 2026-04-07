import { useState } from 'react';
import type { Post } from '@shared/schema';

interface ScheduleFormProps {
  posts: Post[];
  onSchedule: (data: { postId: number; platform: string; scheduledFor: string }) => void;
  isLoading: boolean;
}

const PLATFORMS = ['TikTok', 'Instagram', 'YouTube', 'Facebook', 'Twitter/X'];

export default function ScheduleForm({ posts, onSchedule, isLoading }: ScheduleFormProps) {
  const [postId, setPostId] = useState('');
  const [platform, setPlatform] = useState('');
  const [scheduledFor, setScheduledFor] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postId || !platform || !scheduledFor) return;
    onSchedule({ postId: parseInt(postId, 10), platform, scheduledFor });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <select
        value={postId}
        onChange={(e) => setPostId(e.target.value)}
        required
        className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
      >
        <option value="">Select a post</option>
        {posts.map((p) => (
          <option key={p.id} value={p.id}>
            {p.caption?.slice(0, 50) || `Post #${p.id}`}
          </option>
        ))}
      </select>
      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
        required
        className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
      >
        <option value="">Select platform</option>
        {PLATFORMS.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
      <input
        type="datetime-local"
        value={scheduledFor}
        onChange={(e) => setScheduledFor(e.target.value)}
        required
        className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition"
      >
        {isLoading ? 'Scheduling…' : 'Schedule Post'}
      </button>
    </form>
  );
}
