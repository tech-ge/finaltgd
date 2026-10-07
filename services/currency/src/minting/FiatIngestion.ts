import { Decimal } from 'decimal.js';

import { DuplicateGuard } from './DuplicateGuard.js';
import { toFiat, toTgd } from './DecimalPrecision.js';
import type { Pool } from 'pg';

export interface FiatIngestInput {
  accountId: number;
  fiatAmount: string | number;
  fiatCurrency: string;
  gatewayReference: string;
  gatewayName: string;
}

export class FiatIngestion {
  private readonly guard: DuplicateGuard;

  constructor(private readonly pool: Pool) {
    this.guard = new DuplicateGuard(pool);
  }

  async confirmDeposit(input: FiatIngestInput): Promise<number> {
    if (await this.guard.exists(input.gatewayReference)) {
      throw new Error('duplicate_gateway_reference');
    }

    const amount = toFiat(input.fiatAmount);
    if (amount.lte(0)) {
      throw new Error('fiat_amount_must_be_positive');
    }

    const { rows } = await this.pool.query<{ fn_mint_tgd: number }>(
      'SELECT fn_mint_tgd($1, $2, $3, $4, $5) AS fn_mint_tgd',
      [
        input.accountId,
        amount.toString(),
        input.fiatCurrency.toUpperCase(),
        input.gatewayReference,
        input.gatewayName,
      ],
    );

    const depositId = rows[0]?.fn_mint_tgd;
    if (depositId === undefined) {
      throw new Error('mint_returned_no_id');
    }
    return depositId;
  }
}
