import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlatformSelector from '@/components/platforms/PlatformSelector';
import { useConnectPlatforms } from '@/hooks/usePlatforms';

export default function OnboardingPlatforms() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);
  const connect = useConnectPlatforms();

  const handleContinue = () => {
    if (selected.length === 0) {
      navigate('/app/home');
      return;
    }
    connect.mutate(selected, {
      onSuccess: () => navigate('/app/home'),
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col px-6 py-12">
      <div className="max-w-sm mx-auto w-full">
        <h1 className="text-3xl font-bold text-white mb-2">Connect Platforms</h1>
        <p className="text-gray-400 mb-8">Which platforms do you create for?</p>
        <PlatformSelector selected={selected} onChange={setSelected} />
        <div className="flex flex-col gap-3 mt-8">
          <button
            onClick={handleContinue}
            disabled={connect.isPending}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition"
          >
            {connect.isPending ? 'Saving…' : 'Continue'}
          </button>
          <button
            onClick={() => navigate('/app/home')}
            className="text-gray-500 hover:text-gray-300 py-2 transition text-sm"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
