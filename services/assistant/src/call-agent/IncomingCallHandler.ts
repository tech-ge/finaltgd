import type { HistoryEntry } from './HistoryResponder.js';
import { decide as decideHistory } from './HistoryResponder.js';

export interface IncomingCall {
  accountId: number;
  callerNumber: string;
  receivedAt: Date;
  isKnown: boolean;
}

export interface HandledCall {
  action: 'auto_answer' | 'forward_to_user';
  reason: string;
}

export class IncomingCallHandler {
  handle(call: IncomingCall, history: HistoryEntry[]): HandledCall {
    if (!call.isKnown) {
      return { action: 'forward_to_user', reason: 'unknown_caller' };
    }

    const decision = decideHistory(history, call.callerNumber);
    if (!decision.canRespond) {
      return { action: 'forward_to_user', reason: decision.reason };
    }
    return { action: 'auto_answer', reason: decision.reason };
  }
}
