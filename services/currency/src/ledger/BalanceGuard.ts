import { Decimal } from 'decimal.js';
import type { Pool } from 'pg';

export class BalanceGuard {
  constructor(private readonly pool: Pool) {}

  async balanceOf(accountId: number): Promise<Decimal> {
    const { rows } = await pool.query<{ fn_balance_check: string }>(
      'SELECT fn_balance_check($1) AS fn_balance_check',
      [accountId],
    );
    const value = rows[0]?.fn_balance_check ?? '0';
    return new Decimal(value);
  }

  async assertSufficient(accountId: number, amount: Decimal): Promise<void> {
    const balance = await this.balanceOf(accountId);
    if (balance.lt(amount)) {
      throw new Error('insufficient_balance');
    }
  }
}
