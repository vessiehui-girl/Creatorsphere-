const PLATFORMS = ['TikTok', 'Instagram', 'YouTube', 'Facebook', 'Twitter/X'];

interface PlatformSelectorProps {
  selected: string[];
  onChange: (platforms: string[]) => void;
}

export default function PlatformSelector({ selected, onChange }: PlatformSelectorProps) {
  const toggle = (platform: string) => {
    if (selected.includes(platform)) {
      onChange(selected.filter((p) => p !== platform));
    } else {
      onChange([...selected, platform]);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {PLATFORMS.map((platform) => {
        const active = selected.includes(platform);
        return (
          <button
            key={platform}
            type="button"
            onClick={() => toggle(platform)}
            className={`flex items-center justify-between px-4 py-3 rounded-xl border transition ${
              active ? 'border-blue-500 bg-blue-900/30 text-white' : 'border-gray-700 bg-gray-800 text-gray-300'
            }`}
          >
            <span className="font-medium">{platform}</span>
            {active && <span className="text-blue-400">✓</span>}
          </button>
        );
      })}
    </div>
  );
}
