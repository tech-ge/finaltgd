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

export function isRequest(message: AgentMessage): boolean {
  return message.type === 'request';
}

export function isForbidden(message: AgentMessage): boolean {
  return (
    message.type === 'command' ||
    message.type === 'instruction' ||
    message.type === 'directive' ||
    message.type === 'order'
  );
}
