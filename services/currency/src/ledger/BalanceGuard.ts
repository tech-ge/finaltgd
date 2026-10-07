import { Decimal } from 'decimal.js';
import type { Pool } from 'pg';

import { LedgerError, LEDGER_ERRORS } from '@techgeo/common';

export class BalanceGuard {
  constructor(private readonly pool: Pool) {}

  async balanceOf(accountId: number): Promise<Decimal> {
    const { rows } = await this.pool.query<{ fn_balance_check: string }>(
      'SELECT fn_balance_check($1) AS fn_balance_check',
      [accountId],
    );
    const value = rows[0]?.fn_balance_check ?? '0';
    return new Decimal(value);
  }

  async assertSufficient(accountId: number, amount: Decimal): Promise<void> {
    const balance = await this.balanceOf(accountId);
    if (balance.lt(amount)) {
      throw new LedgerError(
        LEDGER_ERRORS.INSUFFICIENT_BALANCE,
        'Insufficient balance for transfer',
        { accountId, balance: balance.toString(), required: amount.toString() },
      );
    }
  }

  async assertNonNegative(accountId: number): Promise<void> {
    const balance = await this.balanceOf(accountId);
    if (balance.lt(0)) {
      throw new LedgerError(
        'negative_balance_detected',
        'Account balance is negative',
        { accountId, balance: balance.toString() },
      );
    }
  }
}
