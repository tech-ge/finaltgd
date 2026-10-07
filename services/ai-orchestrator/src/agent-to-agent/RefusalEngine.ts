import type { AgentMessage } from './MessageEnvelope.js';

export interface Refusal {
  messageId: string;
  refused: true;
  reason: string;
}

const COMMAND_TYPES = new Set(['command', 'instruction', 'directive', 'order']);
const REQUEST_TYPES = new Set(['request', 'notification', 'response']);

export function evaluate(message: AgentMessage): Refusal | null {
  if (!REQUEST_TYPES.has(message.type)) {
    return {
      messageId: message.messageId,
      refused: true,
      reason: `message_type_not_permitted: ${message.type}`,
    };
  }

  const intentLower = message.intent.toLowerCase();
  for (const cmd of COMMAND_TYPES) {
    if (intentLower.startsWith(cmd)) {
      return {
        messageId: message.messageId,
        refused: true,
        reason: 'commands_are_not_permitted',
      };
    }
  }

  return null;
}
