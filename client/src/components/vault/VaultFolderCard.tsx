import { type LucideIcon } from 'lucide-react';

interface VaultFolderCardProps {
  label: string;
  icon: LucideIcon;
  count: number;
  onClick: () => void;
}

export default function VaultFolderCard({ label, icon: Icon, count, onClick }: VaultFolderCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-4 transition w-full"
    >
      <Icon size={24} className="text-blue-400" />
      <span className="text-white font-semibold">{label}</span>
      <span className="text-gray-400 text-sm">{count} items</span>
    </button>
  );
}
