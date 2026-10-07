import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';

import type { AgentMessage } from './MessageEnvelope.js';

const ALLOWED_INTENTS = new Set([
  'context.read',
  'health.read',
  'location.read',
  'activity.read',
  'call.forward',
  'family.announce',
]);

export interface BuildRequestInput {
  fromAgent: string;
  toAgent: string;
  intent: string;
  payload: Record<string, unknown>;
  signingKey: string;
}

export function buildRequest(input: BuildRequestInput): AgentMessage {
  if (!ALLOWED_INTENTS.has(input.intent)) {
    throw new Error(`intent_not_allowed: ${input.intent}`);
  }

  const envelope: Omit<AgentMessage, 'signature'> = {
    messageId: randomUUID(),
    type: 'request',
    fromAgent: input.fromAgent,
    toAgent: input.toAgent,
    intent: input.intent,
    payload: input.payload,
    issuedAt: Date.now(),
  };

  const signature = signEnvelope(envelope, input.signingKey);
  return { ...envelope, signature };
}

export function signEnvelope(
  envelope: Omit<AgentMessage, 'signature'>,
  key: string,
): string {
  const canonical = [
    envelope.messageId,
    envelope.type,
    envelope.fromAgent,
    envelope.toAgent,
    envelope.intent,
    JSON.stringify(envelope.payload),
    String(envelope.issuedAt),
  ].join('|');
  return createHmac('sha256', key).update(canonical).digest('hex');
}

export function verifyEnvelope(envelope: AgentMessage, key: string): boolean {
  const expected = signEnvelope(
    {
      messageId: envelope.messageId,
      type: envelope.type,
      fromAgent: envelope.fromAgent,
      toAgent: envelope.toAgent,
      intent: envelope.intent,
      payload: envelope.payload,
      issuedAt: envelope.issuedAt,
    },
    key,
  );
  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(envelope.signature, 'hex');
  if (a.length !== b.length) {
    return false;
  }
  return timingSafeEqual(a, b);
}
