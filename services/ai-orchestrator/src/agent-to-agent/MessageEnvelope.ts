export type AgentMessageType = 'request' | 'response' | 'notification';

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

export function isRequest(message: AgentMessage): boolean {
  return message.type === 'request';
}
