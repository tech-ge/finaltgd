export interface Fallback {
  forwardToUser: boolean;
  reason: string;
}

export function evaluateFallback(
  isKnownCaller: boolean,
  confidence: number,
): Fallback {
  if (!isKnownCaller) {
    return { forwardToUser: true, reason: 'unknown_caller' };
  }
  if (confidence < 0.6) {
    return { forwardToUser: true, reason: 'low_confidence' };
  }
  return { forwardToUser: false, reason: 'auto_answer_permitted' };
}
