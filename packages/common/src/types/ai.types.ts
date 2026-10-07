export type AgentMessageType =
  | 'request'
  | 'response'
  | 'notification'
  | 'command'
  | 'instruction'
  | 'directive'
  | 'order';

export interface AgentMessage {
  messageId: string;
  type: AgentMessageType;
  fromAgent: string;
  toAgent: string;
  intent: string;
  payload: Record<string, unknown>;
  issuedAt: number;
  signature: string;
}

export type Scope =
  | 'balance.read'
  | 'activity.read'
  | 'location.read'
  | 'microphone.read'
  | 'health.read'
  | 'business.read'
  | 'call.history.read';

export interface ScopeGrant {
  scope: Scope;
  grantedAt: Date;
  expiresAt: Date;
}

export interface AiRestriction {
  restrictionId: number;
  accountId: number;
  reason: string;
  startsAt: Date;
  endsAt: Date;
  isActive: boolean;
}
