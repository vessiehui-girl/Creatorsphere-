import { useLocation, Link } from 'react-router-dom';
import { Home, PlusSquare, Archive, User } from 'lucide-react';

const tabs = [
  { path: '/app/home', icon: Home, label: 'Home' },
  { path: '/app/create', icon: PlusSquare, label: 'Create' },
  { path: '/app/vault', icon: Archive, label: 'Vault' },
  { path: '/app/me', icon: User, label: 'Me' },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-gray-900 border-t border-gray-800 flex z-50">
      {tabs.map(({ path, icon: Icon, label }) => {
        const active = pathname === path;
        return (
          <Link
            key={path}
            to={path}
            className={`flex-1 flex flex-col items-center py-3 text-xs gap-1 ${active ? 'text-blue-400' : 'text-gray-500'}`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
