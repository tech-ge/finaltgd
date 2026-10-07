import type { HistoryResponder, HistoryEntry } from './HistoryResponder.js';
import type { HumanFallback } from './HumanFallback.js';

export interface IncomingCall {
  accountId: number;
  callerNumber: string;
  receivedAt: Date;
}

export interface HandledCall {
  action: 'auto_answer' | 'forward_to_user';
  reason: string;
}

export class IncomingCallHandler {
  constructor(
    private readonly responder: typeof HistoryResponder,
    private readonly fallback: typeof HumanFallback,
  ) {}

  handle(call: IncomingCall, history: HistoryEntry[]): HandledCall {
    const decision = this.responder.decide(history, call.callerNumber);
    void this.fallback;
    if (!decision.canRespond) {
      return { action: 'forward_to_user', reason: decision.reason };
    }
    return { action: 'auto_answer', reason: decision.reason };
  }
}
