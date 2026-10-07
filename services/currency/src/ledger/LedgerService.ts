import { Decimal } from 'decimal.js';
import type { Pool } from 'pg';
import type { Redis } from 'ioredis';

import { AtomicTransfer } from './AtomicTransfer.js';
import { BalanceGuard } from './BalanceGuard.js';
import type { LedgerTransfer } from '@techgeo/common';

export interface SendInput {
  fromAccount: number;
  toAccount: number;
  amount: Decimal;
  idempotencyKey: string;
  reference: string;
  memo?: string;
}

export interface TransferResult {
  transferId: number;
  reference: string;
  amount: string;
}

export class LedgerService {
  readonly transfer: AtomicTransfer;
  readonly balance: BalanceGuard;

  constructor(private readonly pool: Pool, ledgerRedis: Redis) {
    this.transfer = new AtomicTransfer(pool, ledgerRedis);
    this.balance = new BalanceGuard(pool);
  }

  async sendP2P(input: SendInput): Promise<TransferResult> {
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

  async sendBusiness(input: SendInput): Promise<TransferResult> {
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

  async listTransfers(accountId: number, limit = 100): Promise<LedgerTransfer[]> {
    const { rows } = await this.pool.query<{
      transfer_id: number;
      operation: string;
      from_account: number | null;
      to_account: number;
      amount: string;
      currency_code: string;
      reference: string;
      idempotency_key: string;
      memo: string | null;
      created_at: Date;
    }>(
      `SELECT transfer_id, operation, from_account, to_account, amount,
              currency_code, reference, idempotency_key, memo, created_at
       FROM ledger_transfers
       WHERE from_account = $1 OR to_account = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [accountId, limit],
    );

    return rows.map((r) => ({
      transferId: r.transfer_id,
      operation: r.operation as LedgerTransfer['operation'],
      fromAccount: r.from_account,
      toAccount: r.to_account,
      amount: new Decimal(r.amount),
      currencyCode: r.currency_code,
      reference: r.reference,
      idempotencyKey: r.idempotency_key,
      memo: r.memo,
      createdAt: r.created_at,
    }));
  }
}
