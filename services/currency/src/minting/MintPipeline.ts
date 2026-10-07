import { Decimal } from 'decimal.js';
import type { Pool } from 'pg';

import { LedgerError } from '@techgeo/common';

import { DuplicateGuard } from './DuplicateGuard.js';
import { toFiat, toTgd } from './DecimalPrecision.js';

export interface MintInput {
  accountId: number;
  fiatAmount: string | number;
  fiatCurrency: string;
  gatewayReference: string;
  gatewayName: string;
}

export interface MintResult {
  depositId: number;
  tgdCredited: string;
  appliedRate: string;
}

export class MintPipeline {
  private readonly guard: DuplicateGuard;

  constructor(private readonly pool: Pool) {
    this.guard = new DuplicateGuard(pool);
  }

  async run(input: MintInput): Promise<MintResult> {
    if (await this.guard.exists(input.gatewayReference)) {
      throw new LedgerError(
        'duplicate_gateway_reference',
        'Deposit with this gateway reference already exists',
      );
    }

    const fiat = toFiat(input.fiatAmount);
    if (fiat.lte(0)) {
      throw new LedgerError(
        'fiat_amount_must_be_positive',
        'Deposit amount must be positive',
      );
    }

    const { rows: rateRows } = await this.pool.query<{ fiat_per_one_tgd: string }>(
      `SELECT fiat_per_one_tgd FROM currency_rates
       WHERE fiat_currency_code = $1 AND is_active = TRUE`,
      [input.fiatCurrency.toUpperCase()],
    );

    const rateValue = rateRows[0]?.fiat_per_one_tgd;
    if (!rateValue) {
      throw new LedgerError(
        'no_active_rate_for_currency',
        `No active rate for ${input.fiatCurrency}`,
      );
    }

    const appliedRate = new Decimal(rateValue);
    const tgdCredited = toTgd(fiat.dividedBy(appliedRate));

    const { rows } = await this.pool.query<{ fn_mint_tgd: number }>(
      'SELECT fn_mint_tgd($1, $2, $3, $4, $5) AS fn_mint_tgd',
      [
        input.accountId,
        fiat.toString(),
        input.fiatCurrency.toUpperCase(),
        input.gatewayReference,
        input.gatewayName,
      ],
    );

    const depositId = rows[0]?.fn_mint_tgd;
    if (depositId === undefined) {
      throw new LedgerError('mint_returned_no_id', 'Mint returned no deposit identifier');
    }

    return {
      depositId,
      tgdCredited: tgdCredited.toString(),
      appliedRate: appliedRate.toString(),
    };
  }
}
