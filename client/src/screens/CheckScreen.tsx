import React from 'react';

interface CheckScreenProps {
  onComplete: (primarySignalTriggered: boolean, additionalTriggeredSignals: number) => void;
}

const CheckScreen: React.FC<CheckScreenProps> = ({ onComplete }) => {
  const [primarySignalTriggered, setPrimarySignalTriggered] = React.useState(false);
  const [additionalTriggeredSignals, setAdditionalTriggeredSignals] = React.useState(0);

  const totalSignals = (primarySignalTriggered ? 1 : 0) + additionalTriggeredSignals;

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="mx-auto flex h-screen w-full max-w-md flex-col justify-center gap-6 px-6">
        <h1 className="text-2xl font-semibold">/check</h1>
        <p className="text-sm text-slate-300">State scan (reactive if 2 or more signals are triggered, max 3 total).</p>

        <label className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900 px-4 py-3">
          <span>Primary signal triggered</span>
          <input
            type="checkbox"
            checked={primarySignalTriggered}
            onChange={(event) => setPrimarySignalTriggered(event.target.checked)}
            aria-label="Primary signal triggered"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-slate-300">Additional triggered signals</span>
          <select
            value={String(additionalTriggeredSignals)}
            onChange={(event) => setAdditionalTriggeredSignals(Number(event.target.value))}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
            aria-label="Additional triggered signals"
          >
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </label>

        <p className="text-sm text-slate-400">Signals active: {totalSignals}/3</p>

        <button
          type="button"
          onClick={() => onComplete(primarySignalTriggered, additionalTriggeredSignals)}
          className="rounded-lg bg-sky-500 px-4 py-3 font-medium text-slate-950"
        >
          Continue
        </button>
      </div>
    </main>
  );
};

export default CheckScreen;
