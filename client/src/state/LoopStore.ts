export type LoopStage = 'CHECK' | 'RESET' | 'ACT' | 'RESULT';

export type LoopResult = 'success' | 'failed';

export interface LoopState {
  stage: LoopStage;
  triggeredSignals: number;
  reactive: boolean;
  action: string;
  outcome: string;
  constraint: string;
  result: LoopResult | null;
  variableChange: string;
}

export type LoopEvent =
  | { type: 'COMPLETE_CHECK'; primarySignalTriggered: boolean; additionalTriggeredSignals: number }
  | { type: 'COMPLETE_RESET'; action: string; outcomeAndConstraint: string }
  | { type: 'COMPLETE_ACT' }
  | { type: 'COMPLETE_RESULT'; result: LoopResult; variableChange: string };

export const createInitialLoopState = (): LoopState => ({
  stage: 'CHECK',
  triggeredSignals: 0,
  reactive: false,
  action: '',
  outcome: '',
  constraint: '',
  result: null,
  variableChange: '',
});

export const stageToPath = (stage: LoopStage): string => `/${stage.toLowerCase()}`;

export const isReactive = (primarySignalTriggered: boolean, additionalTriggeredSignals: number): boolean => {
  const totalSignals = (primarySignalTriggered ? 1 : 0) + additionalTriggeredSignals;
  return totalSignals >= 2;
};

const parseOutcomeAndConstraint = (value: string): { outcome: string; constraint: string } | null => {
  const [outcome = '', constraint = ''] = value.split('|').map((item) => item.trim());

  if (!outcome || !constraint) {
    return null;
  }

  return { outcome, constraint };
};

export const loopReducer = (state: LoopState, event: LoopEvent): LoopState => {
  switch (event.type) {
    case 'COMPLETE_CHECK': {
      if (state.stage !== 'CHECK') {
        return state;
      }

      const triggeredSignals = (event.primarySignalTriggered ? 1 : 0) + event.additionalTriggeredSignals;
      const reactive = isReactive(event.primarySignalTriggered, event.additionalTriggeredSignals);

      return {
        ...state,
        triggeredSignals,
        reactive,
        stage: reactive ? 'RESET' : 'ACT',
      };
    }
    case 'COMPLETE_RESET': {
      if (state.stage !== 'RESET') {
        return state;
      }

      const parsed = parseOutcomeAndConstraint(event.outcomeAndConstraint);
      if (!event.action.trim() || !parsed) {
        return state;
      }

      return {
        ...state,
        action: event.action.trim(),
        outcome: parsed.outcome,
        constraint: parsed.constraint,
        stage: 'ACT',
      };
    }
    case 'COMPLETE_ACT': {
      if (state.stage !== 'ACT') {
        return state;
      }

      return {
        ...state,
        stage: 'RESULT',
      };
    }
    case 'COMPLETE_RESULT': {
      if (state.stage !== 'RESULT') {
        return state;
      }

      if (event.result === 'failed' && !event.variableChange.trim()) {
        return state;
      }

      return {
        ...state,
        result: event.result,
        variableChange: event.variableChange.trim(),
        stage: 'CHECK',
      };
    }
    default:
      return state;
  }
};
