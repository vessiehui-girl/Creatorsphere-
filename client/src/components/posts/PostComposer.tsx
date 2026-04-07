import { useState } from 'react';

const PLATFORMS = ['TikTok', 'Instagram', 'YouTube', 'Facebook', 'Twitter/X'];

interface PostComposerProps {
  onSave: (data: { caption: string; platforms: string[]; status: 'draft' | 'posted' }) => void;
  isLoading: boolean;
}

export default function PostComposer({ onSave, isLoading }: PostComposerProps) {
  const [caption, setCaption] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (p: string) =>
    setSelected((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));

  return (
    <div className="flex flex-col gap-4">
      <textarea
        placeholder="Write your caption…"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        rows={5}
        className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
      />
      <div>
        <p className="text-gray-400 text-sm mb-2">Platforms</p>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => toggle(p)}
              className={`px-3 py-1 rounded-full text-sm border transition ${
                selected.includes(p)
                  ? 'border-blue-500 bg-blue-900/30 text-white'
                  : 'border-gray-700 text-gray-400'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => onSave({ caption, platforms: selected, status: 'draft' })}
          disabled={isLoading}
          className="flex-1 border border-gray-600 text-gray-300 hover:bg-gray-800 py-3 rounded-xl transition disabled:opacity-50"
        >
          Save as Draft
        </button>
        <button
          onClick={() => onSave({ caption, platforms: selected, status: 'posted' })}
          disabled={isLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
        >
          Post Now
        </button>
      </div>
    </div>
  );
}
