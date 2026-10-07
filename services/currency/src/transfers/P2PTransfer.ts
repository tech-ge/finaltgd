import type { LedgerService } from '../ledger/LedgerService.js';

export interface P2PInput {
  fromAccount: number;
  toAccount: number;
  amount: string;
  idempotencyKey: string;
  memo?: string;
}

export class P2PTransfer {
  constructor(private readonly ledger: LedgerService) {}

  async run(input: P2PInput) {
    const { Decimal } = await import('decimal.js');
    return this.ledger.sendP2P({
      fromAccount: input.fromAccount,
      toAccount: input.toAccount,
      amount: new Decimal(input.amount),
      idempotencyKey: input.idempotencyKey,
      reference: `p2p:${input.idempotencyKey}`,
      memo: input.memo,
    });
  }
}
