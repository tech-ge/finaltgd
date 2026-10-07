import type { AiOrchestratorClient } from './AiOrchestratorClient.js';

export interface AgentMessage {
  messageId: string;
  type: 'request' | 'response' | 'notification';
  fromAgent: string;
  toAgent: string;
  intent: string;
  payload: Record<string, unknown>;
  issuedAt: number;
  signature: string;
}

export interface Refusal {
  messageId: string;
  refused: true;
  reason: string;
}

export class AgentToAgentClient {
  constructor(private readonly client: AiOrchestratorClient) {}

  async send(message: AgentMessage): Promise<Refusal | Record<string, unknown>> {
    const response = await this.client.request<Refusal | Record<string, unknown>>({
      path: '/agent-to-agent',
      body: message,
    });
    if (!response.ok || !response.data) {
      throw new Error(`agent_message_failed_status_${response.status}`);
    }
    return response.data;
  }
}
