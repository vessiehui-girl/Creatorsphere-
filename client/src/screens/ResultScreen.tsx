import React from 'react';
import type { LoopResult } from '@/state/LoopStore';

interface ResultScreenProps {
  onComplete: (result: LoopResult, variableChange: string) => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ onComplete }) => {
  const [result, setResult] = React.useState<LoopResult>('success');
  const [variableChange, setVariableChange] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const submit = () => {
    if (result === 'failed' && !variableChange.trim()) {
      setError('Please describe what variable was changed when the action failed.');
      return;
    }

    setError(null);
    onComplete(result, variableChange);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="mx-auto flex h-screen w-full max-w-md flex-col justify-center gap-6 px-6">
        <h1 className="text-2xl font-semibold">/result</h1>
        <p className="text-sm text-slate-300">Outcome check before the next /check.</p>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-slate-300">Outcome</span>
          <select
            value={result}
            onChange={(event) => setResult(event.target.value as LoopResult)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
          >
            <option value="success">success</option>
            <option value="failed">failed</option>
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-slate-300">Variable change {result === 'failed' ? '(required)' : '(optional)'}</span>
          <input
            type="text"
            value={variableChange}
            onChange={(event) => setVariableChange(event.target.value)}
            placeholder="e.g. changed CTA from offer A to B"
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
          />
        </label>

        {error ? <p className="text-sm text-rose-400">{error}</p> : null}

        <button
          type="button"
          onClick={submit}
          className="rounded-lg bg-sky-500 px-4 py-3 font-medium text-slate-950"
        >
          Continue loop
        </button>
      </div>
    </main>
  );
};

export default ResultScreen;
