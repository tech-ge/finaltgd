import type { AiOrchestratorClient } from './AiOrchestratorClient.js';

export interface AuditCount {
  count: number;
}

export interface AuditVerify {
  valid: boolean;
}

export class AuditClient {
  constructor(private readonly client: AiOrchestratorClient) {}

  async count(): Promise<AuditCount> {
    const response = await this.client.request<AuditCount>({
      method: 'GET',
      path: '/audit/count',
    });
    if (!response.ok || !response.data) {
      throw new Error(`audit_count_failed_status_${response.status}`);
    }
    return response.data;
  }

  async verify(): Promise<AuditVerify> {
    const response = await this.client.request<AuditVerify>({
      method: 'GET',
      path: '/audit/verify',
    });
    if (!response.ok || !response.data) {
      throw new Error(`audit_verify_failed_status_${response.status}`);
    }
    return response.data;
  }
}
