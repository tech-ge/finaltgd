import type { LedgerService } from '../ledger/LedgerService.js';

export interface B2BInput {
  fromBusinessAccount: number;
  toBusinessAccount: number;
  amount: string;
  idempotencyKey: string;
  memo?: string;
}

export class B2BTransfer {
  constructor(private readonly ledger: LedgerService) {}

  async run(input: B2BInput) {
    const { Decimal } = await import('decimal.js');
    return this.ledger.sendToBusiness({
      fromAccount: input.fromBusinessAccount,
      toAccount: input.toBusinessAccount,
      amount: new Decimal(input.amount),
      idempotencyKey: input.idempotencyKey,
      reference: `b2b:${input.idempotencyKey}`,
      memo: input.memo,
    });
  }
}
