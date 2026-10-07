export interface FallbackDecision {
  forwardToUser: boolean;
  reason: string;
}

export function evaluate(confidence: number, isKnownCaller: boolean): FallbackDecision {
  if (!isKnownCaller) {
    return { forwardToUser: true, reason: 'unknown_caller' };
  }
  if (confidence < 0.6) {
    return { forwardToUser: true, reason: 'low_confidence' };
  }
  return { forwardToUser: false, reason: 'auto_answer_permitted' };
}
