export interface HistoryEntry {
  caller: string;
  topic: string;
  outcome: string;
  at: Date;
}

export interface ResponseDecision {
  canRespond: boolean;
  confidence: number;
  reason: string;
}

const MIN_CONFIDENCE = 0.6;

export function decide(history: HistoryEntry[], caller: string): ResponseDecision {
  const matching = history.filter((h) => h.caller === caller);
  if (matching.length === 0) {
    return { canRespond: false, confidence: 0, reason: 'no_history' };
  }

  const confidence = Math.min(1, matching.length / 5);
  if (confidence < MIN_CONFIDENCE) {
    return { canRespond: false, confidence, reason: 'insufficient_history' };
  }

  const last = matching[matching.length - 1];
  return {
    canRespond: true,
    confidence,
    reason: `prior_topic: ${last?.topic ?? 'unknown'}`,
  };
}
