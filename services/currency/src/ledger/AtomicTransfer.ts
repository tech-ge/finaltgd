import { Decimal } from 'decimal.js';
import type { Pool } from 'pg';
import type { Redis } from 'ioredis';

import { LedgerError, LEDGER_ERRORS } from '@techgeo/common';

import { assertOperationAllowed } from './policy.js';
import { RedisLock } from './RedisLock.js';

export interface TransferInput {
  operation: string;
  fromAccount: number;
  toAccount: number;
  amount: Decimal;
  reference: string;
  idempotencyKey: string;
  memo?: string;
}

export interface TransferResult {
  transferId: number;
  reference: string;
  amount: string;
}

export class AtomicTransfer {
  private readonly lock: RedisLock;

  constructor(private readonly pool: Pool, ledgerRedis: Redis) {
    this.lock = new RedisLock(ledgerRedis);
  }

  async execute(input: TransferInput): Promise<TransferResult> {
    assertOperationAllowed(input.operation);

    if (input.amount.lte(0)) {
      throw new LedgerError(
        LEDGER_ERRORS.AMOUNT_MUST_BE_POSITIVE,
        'Amount must be positive',
      );
    }
    if (input.fromAccount === input.toAccount) {
      throw new LedgerError(
        LEDGER_ERRORS.FROM_TO_MUST_DIFFER,
        'From and to accounts must differ',
      );
    }

    const lockKey = `lock:transfer:${input.idempotencyKey}`;

    return this.lock.withLock(lockKey, async () => {
      const client = await this.pool.connect();
      try {
        await client.query('BEGIN');

        const { rows } = await client.query<{ fn_atomic_transfer: number }>(
          'SELECT fn_atomic_transfer($1, $2, $3, $4, $5, $6, $7) AS fn_atomic_transfer',
          [
            input.operation,
            input.fromAccount,
            input.toAccount,
            input.amount.toString(),
            input.reference,
            input.idempotencyKey,
            input.memo ?? null,
          ],
        );

        await client.query('COMMIT');

        const transferId = rows[0]?.fn_atomic_transfer;
        if (transferId === undefined) {
          throw new LedgerError(
            'transfer_returned_no_id',
            'Atomic transfer returned no identifier',
          );
        }

        return {
          transferId,
          reference: input.reference,
          amount: input.amount.toString(),
        };
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    });
  }
}
