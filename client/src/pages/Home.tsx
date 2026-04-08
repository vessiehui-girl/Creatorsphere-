import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useLogout } from '@/hooks/useLogout';
import { useVault } from '@/hooks/useVault';
import { usePosts } from '@/hooks/usePosts';
import { usePlatforms } from '@/hooks/usePlatforms';
import { Archive, PlusSquare, Calendar, BarChart2, LogOut } from 'lucide-react';

export default function Home() {
  const { data: user } = useCurrentUser();
  const { data: vaultItems = [] } = useVault();
  const { data: posts = [] } = usePosts();
  const { data: platforms = [] } = usePlatforms();
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout.mutate(undefined, { onSuccess: () => navigate('/') });
  };

  const navCards = [
    { label: 'Creator Vault', desc: 'Your media library', icon: Archive, path: '/app/vault', color: 'bg-purple-900/40 border-purple-700' },
    { label: 'Create & Share', desc: 'Compose a new post', icon: PlusSquare, path: '/app/create', color: 'bg-blue-900/40 border-blue-700' },
    { label: 'Content Planner', desc: 'Schedule your content', icon: Calendar, path: '/app/planner', color: 'bg-green-900/40 border-green-700' },
    { label: 'Analytics', desc: 'Track performance', icon: BarChart2, path: '/app/analytics', color: 'bg-orange-900/40 border-orange-700' },
  ];

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-400 text-sm">Welcome back</p>
          <h1 className="text-2xl font-bold text-white">{user?.name || user?.email?.split('@')[0] || 'Creator'}</h1>
        </div>
        <button onClick={handleLogout} className="text-gray-500 hover:text-gray-300">
          <LogOut size={20} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-3xl font-bold text-white">{vaultItems.length}</p>
          <p className="text-gray-400 text-sm mt-1">Vault Items</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-3xl font-bold text-white">{posts.length}</p>
          <p className="text-gray-400 text-sm mt-1">Posts</p>
        </div>
      </div>

      {platforms.length > 0 && (
        <div className="mb-6">
          <p className="text-gray-400 text-sm mb-2">Connected Platforms</p>
          <div className="flex flex-wrap gap-2">
            {platforms.filter((p: any) => p.connected).map((p: any) => (
              <span key={p.id} className="bg-blue-900/30 border border-blue-700 text-blue-300 text-xs px-3 py-1 rounded-full">
                {p.platform}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-6">
        {navCards.map(({ label, desc, icon: Icon, path, color }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex flex-col items-start gap-2 ${color} border rounded-xl p-4 text-left transition hover:opacity-80`}
          >
            <Icon size={24} className="text-white" />
            <span className="text-white font-semibold text-sm">{label}</span>
            <span className="text-gray-400 text-xs">{desc}</span>
          </button>
        ))}
      </div>

      {vaultItems.length > 0 && (
        <div>
          <p className="text-gray-400 text-sm mb-2">Recent Vault Items</p>
          <div className="flex flex-col gap-2">
            {vaultItems.slice(0, 3).map((item: any) => (
              <div key={item.id} className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3">
                <p className="text-white font-medium">{item.title}</p>
                <p className="text-gray-400 text-xs">{item.type}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
