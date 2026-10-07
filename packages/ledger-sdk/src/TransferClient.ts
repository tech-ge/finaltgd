import { Decimal } from 'decimal.js';

import type { TechGeoLedgerClient } from './TechGeoLedgerClient.js';

export interface TransferInput {
  fromAccount: number;
  toAccount: number;
  amount: string | Decimal;
  idempotencyKey: string;
  memo?: string;
}

export interface TransferResult {
  transferId: number;
  reference: string;
  amount: string;
}

export class TransferClient {
  constructor(private readonly client: TechGeoLedgerClient) {}

  async internal(input: TransferInput): Promise<TransferResult> {
    return this.send('/send/internal', input);
  }

  async toBusiness(input: TransferInput): Promise<TransferResult> {
    return this.send('/send/b2c', input);
  }

  async businessToBusiness(input: TransferInput): Promise<TransferResult> {
    return this.send('/send/b2b', input);
  }

  private async send(path: string, input: TransferInput): Promise<TransferResult> {
    const amount = input.amount instanceof Decimal ? input.amount.toString() : input.amount;
    const response = await this.client.request<TransferResult>({
      path,
      body: {
        fromAccount: input.fromAccount,
        toAccount: input.toAccount,
        amount,
        idempotencyKey: input.idempotencyKey,
        memo: input.memo,
      },
    });
    if (!response.ok || !response.data) {
      throw new Error(`transfer_failed_status_${response.status}`);
    }
    return response.data;
  }
}
