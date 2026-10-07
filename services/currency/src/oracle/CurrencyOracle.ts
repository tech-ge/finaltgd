import { Decimal } from 'decimal.js';
import type { Pool } from 'pg';

import { snapshot, type RateSnapshot } from './RateSnapshot.js';

export class CurrencyOracle {
  constructor(private readonly pool: Pool) {}

  async getRate(fiatCurrency: string): Promise<RateSnapshot> {
    const { rows } = await pool.query<{
      fiat_currency_code: string;
      fiat_per_one_tgd: string;
    }>(
      `SELECT fiat_currency_code, fiat_per_one_tgd
       FROM currency_rates
       WHERE fiat_currency_code = $1 AND is_active = TRUE`,
      [fiatCurrency.toUpperCase()],
    );

    const row = rows[0];
    if (!row) {
      throw new Error(`no_active_rate_for_currency: ${fiatCurrency}`);
    }

    return snapshot({
      fiatCurrency: row.fiat_currency_code,
      fiatPerOneTgd: row.fiat_per_one_tgd,
    });
  }

  async convertToTgd(fiatAmount: Decimal, fiatCurrency: string): Promise<Decimal> {
    const rate = await this.getRate(fiatCurrency);
    return fiatAmount.dividedBy(rate.fiatPerOneTgd).toDecimalPlaces(4);
  }
}
