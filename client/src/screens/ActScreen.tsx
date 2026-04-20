import React from 'react';

interface ActScreenProps {
  action: string;
  onComplete: () => void;
}

const ActScreen: React.FC<ActScreenProps> = ({ action, onComplete }) => {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="mx-auto flex h-screen w-full max-w-md flex-col justify-center gap-6 px-6">
        <h1 className="text-2xl font-semibold">/act</h1>
        <p className="text-sm text-slate-300">Execution step (one action).</p>

        <div className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200">
          Action: {action || 'Proceed with current plan'}
        </div>

        <button
          type="button"
          onClick={onComplete}
          className="rounded-lg bg-sky-500 px-4 py-3 font-medium text-slate-950"
        >
          Execute action
        </button>
      </div>
    </main>
  );
};

export default ActScreen;
