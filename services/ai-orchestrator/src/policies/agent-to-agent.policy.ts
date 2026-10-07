export const AGENT_TO_AGENT_POLICY = {
  allowedMessageTypes: ['request', 'notification', 'response'] as const,
  forbiddenMessageTypes: ['command', 'instruction', 'directive', 'order'] as const,
  maxHops: 3,
  requestTtlMs: 60_000,
  requireSignature: true,
  requireExplicitIntent: true,
} as const;
