import React from 'react';

export default function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white max-w-md mx-auto relative pb-20">
      {children}
    </div>
  );
}
