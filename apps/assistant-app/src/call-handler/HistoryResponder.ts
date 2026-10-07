export interface CallHistoryEntry {
  caller: string;
  topic: string;
  outcome: string;
  at: number;
}

export interface HistoryDecision {
  canRespond: boolean;
  confidence: number;
  reason: string;
}

export function decideFromHistory(
  history: CallHistoryEntry[],
  caller: string,
): HistoryDecision {
  const matching = history.filter((h) => h.caller === caller);
  if (matching.length === 0) {
    return { canRespond: false, confidence: 0, reason: 'no_history' };
  }
  const confidence = Math.min(1, matching.length / 5);
  return {
    canRespond: confidence >= 0.6,
    confidence,
    reason: confidence >= 0.6 ? 'history_sufficient' : 'history_insufficient',
  };
}
