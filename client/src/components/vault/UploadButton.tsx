import { useRef } from 'react';
import { Plus } from 'lucide-react';

interface UploadButtonProps {
  onUpload: (file: File) => void;
}

export default function UploadButton({ onUpload }: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-xl transition"
      >
        <Plus size={20} />
        Upload
      </button>
    </>
  );
}
