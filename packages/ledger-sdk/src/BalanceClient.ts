import type { TechGeoLedgerClient } from './TechGeoLedgerClient.js';

export interface BalanceResult {
  accountId: number;
  balance: string;
  currency: string;
}

export class BalanceClient {
  constructor(private readonly client: TechGeoLedgerClient) {}

  async read(accountId: number): Promise<BalanceResult> {
    const response = await this.client.request<BalanceResult>({
      method: 'GET',
      path: `/balance/${accountId}`,
    });
    if (!response.ok || !response.data) {
      throw new Error(`balance_read_failed_status_${response.status}`);
    }
    return response.data;
  }
}
