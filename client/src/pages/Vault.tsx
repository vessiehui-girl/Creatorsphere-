import { useNavigate } from 'react-router-dom';
import VaultFolderCard from '@/components/vault/VaultFolderCard';
import UploadButton from '@/components/vault/UploadButton';
import { useVault } from '@/hooks/useVault';
import { Video, Image, FileText, Lightbulb, FileEdit } from 'lucide-react';

const FOLDER_TYPES = [
  { label: 'Videos', type: 'video', icon: Video },
  { label: 'Photos', type: 'photo', icon: Image },
  { label: 'Captions', type: 'caption', icon: FileText },
  { label: 'Ideas', type: 'idea', icon: Lightbulb },
  { label: 'Draft Posts', type: 'draft', icon: FileEdit },
];

export default function Vault() {
  const { data: items = [] } = useVault();

  const countFor = (type: string) => items.filter((i: any) => i.type === type).length;

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Creator Vault</h1>
        <UploadButton onUpload={(file) => console.log('Upload:', file.name)} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {FOLDER_TYPES.map(({ label, type, icon }) => (
          <VaultFolderCard
            key={type}
            label={label}
            icon={icon}
            count={countFor(type)}
            onClick={() => {}}
          />
        ))}
      </div>

      {items.length > 0 && (
        <div>
          <p className="text-gray-400 text-sm mb-2">All Items</p>
          <div className="flex flex-col gap-2">
            {items.map((item: any) => (
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
