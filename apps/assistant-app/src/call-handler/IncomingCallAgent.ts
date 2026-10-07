export interface IncomingCall {
  callerNumber: string;
  receivedAt: number;
  isKnown: boolean;
}

export interface CallDecision {
  action: 'auto_answer' | 'forward_to_user';
  reason: string;
}

export function decideIncoming(call: IncomingCall): CallDecision {
  if (!call.isKnown) {
    return { action: 'forward_to_user', reason: 'unknown_caller' };
  }
  return { action: 'auto_answer', reason: 'known_caller_with_history' };
}
