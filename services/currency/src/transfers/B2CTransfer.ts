import type { LedgerService } from '../ledger/LedgerService.js';

export interface B2CInput {
  fromBusinessAccount: number;
  toUserAccount: number;
  amount: string;
  idempotencyKey: string;
  memo?: string;
}

export class B2CTransfer {
  constructor(private readonly ledger: LedgerService) {}

  async run(input: B2CInput) {
    const { Decimal } = await import('decimal.js');
    return this.ledger.sendToBusiness({
      fromAccount: input.fromBusinessAccount,
      toAccount: input.toUserAccount,
      amount: new Decimal(input.amount),
      idempotencyKey: input.idempotencyKey,
      reference: `b2c:${input.idempotencyKey}`,
      memo: input.memo,
    });
  }
}
