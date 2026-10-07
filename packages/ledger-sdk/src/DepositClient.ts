import type { TechGeoLedgerClient } from './TechGeoLedgerClient.js';

export interface DepositInput {
  accountId: number;
  fiatAmount: string;
  fiatCurrency: string;
  gatewayReference: string;
  gatewayName: 'mpesa' | 'bank';
}

export interface DepositResult {
  depositId: number;
}

export class DepositClient {
  constructor(private readonly client: TechGeoLedgerClient) {}

  async create(input: DepositInput): Promise<DepositResult> {
    const response = await this.client.request<DepositResult>({
      path: '/deposit',
      body: input,
    });
    if (!response.ok || !response.data) {
      throw new Error(`deposit_failed_status_${response.status}`);
    }
    return response.data;
  }
}
