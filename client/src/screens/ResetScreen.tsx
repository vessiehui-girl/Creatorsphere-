import React from 'react';

interface ResetScreenProps {
  onComplete: (action: string, outcomeAndConstraint: string) => void;
}

const ResetScreen: React.FC<ResetScreenProps> = ({ onComplete }) => {
  const [action, setAction] = React.useState('');
  const [outcomeAndConstraint, setOutcomeAndConstraint] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const submit = () => {
    const [outcome = '', constraint = ''] = outcomeAndConstraint.split('|').map((value) => value.trim());

    if (!action.trim() || !outcome || !constraint) {
      setError('All fields are required: action, outcome, and constraint. Format: outcome | constraint');
      return;
    }

    setError(null);
    onComplete(action, outcomeAndConstraint);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="mx-auto flex h-screen w-full max-w-md flex-col justify-center gap-6 px-6">
        <h1 className="text-2xl font-semibold">/reset</h1>
        <p className="text-sm text-slate-300">Interrupt and prepare the next execution.</p>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-slate-300">Action</span>
          <input
            type="text"
            value={action}
            onChange={(event) => setAction(event.target.value)}
            placeholder="e.g. refine offer"
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-slate-300">Outcome | Constraint</span>
          <input
            type="text"
            value={outcomeAndConstraint}
            onChange={(event) => setOutcomeAndConstraint(event.target.value)}
            placeholder="e.g. higher replies | 2-hour limit"
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
          />
        </label>

        {error ? <p className="text-sm text-rose-400">{error}</p> : null}

        <button
          type="button"
          onClick={submit}
          className="rounded-lg bg-sky-500 px-4 py-3 font-medium text-slate-950"
        >
          Continue
        </button>
      </div>
    </main>
  );
};

export default ResetScreen;
