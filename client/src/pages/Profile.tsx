import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useLogout } from '@/hooks/useLogout';
import { usePlatforms } from '@/hooks/usePlatforms';

export default function Profile() {
  const { data: user } = useCurrentUser();
  const { data: platforms = [] } = usePlatforms();
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout.mutate(undefined, { onSuccess: () => navigate('/') });
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-4">
        <p className="text-gray-400 text-xs mb-1">Name</p>
        <p className="text-white font-medium">{user?.name || '—'}</p>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-6">
        <p className="text-gray-400 text-xs mb-1">Email</p>
        <p className="text-white font-medium">{user?.email}</p>
      </div>

      {platforms.length > 0 && (
        <div className="mb-6">
          <p className="text-gray-400 text-sm mb-2">Connected Platforms</p>
          <div className="flex flex-col gap-2">
            {platforms.map((p: any) => (
              <div key={p.id} className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 flex justify-between items-center">
                <span className="text-white">{p.platform}</span>
                <span className={`text-xs ${p.connected ? 'text-green-400' : 'text-gray-500'}`}>
                  {p.connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button className="w-full border border-gray-600 text-gray-300 hover:bg-gray-800 py-3 rounded-xl mb-3 transition">
        Edit Profile (Coming Soon)
      </button>

      <button
        onClick={handleLogout}
        className="w-full bg-red-900/40 hover:bg-red-900/60 border border-red-800 text-red-400 font-semibold py-3 rounded-xl transition"
      >
        Log Out
      </button>
    </div>
  );
}
