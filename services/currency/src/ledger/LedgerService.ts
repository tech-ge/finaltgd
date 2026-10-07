import { Decimal } from 'decimal.js';
import type { Pool } from 'pg';
import type { Redis } from 'ioredis';

import { AtomicTransfer } from './AtomicTransfer.js';
import { BalanceGuard } from './BalanceGuard.js';

export class LedgerService {
  readonly transfer: AtomicTransfer;
  readonly balance: BalanceGuard;

  constructor(pool: Pool, ledgerRedis: Redis) {
    this.transfer = new AtomicTransfer(pool, ledgerRedis);
    this.balance = new BalanceGuard(pool);
  }

  async sendP2P(input: {
    fromAccount: number;
    toAccount: number;
    amount: Decimal;
    idempotencyKey: string;
    reference: string;
    memo?: string;
  }) {
    await this.balance.assertSufficient(input.fromAccount, input.amount);
    return this.transfer.execute({
      operation: 'SEND_INTERNAL',
      fromAccount: input.fromAccount,
      toAccount: input.toAccount,
      amount: input.amount,
      reference: input.reference,
      idempotencyKey: input.idempotencyKey,
      memo: input.memo,
    });
  }

  async sendToBusiness(input: {
    fromAccount: number;
    toAccount: number;
    amount: Decimal;
    idempotencyKey: string;
    reference: string;
    memo?: string;
  }) {
    await this.balance.assertSufficient(input.fromAccount, input.amount);
    return this.transfer.execute({
      operation: 'SEND_BUSINESS',
      fromAccount: input.fromAccount,
      toAccount: input.toAccount,
      amount: input.amount,
      reference: input.reference,
      idempotencyKey: input.idempotencyKey,
      memo: input.memo,
    });
  }
}
