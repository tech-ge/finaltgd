export interface FallbackDecision {
  forwardToUser: boolean;
  reason: string;
}

const MIN_CONFIDENCE = 0.6;

export function evaluate(confidence: number, isKnownCaller: boolean): FallbackDecision {
  if (!isKnownCaller) {
    return { forwardToUser: true, reason: 'unknown_caller' };
  }
  if (confidence < MIN_CONFIDENCE) {
    return { forwardToUser: true, reason: 'low_confidence' };
  }
  return { forwardToUser: false, reason: 'auto_answer_permitted' };
}
