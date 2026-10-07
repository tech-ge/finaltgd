import { Decimal } from 'decimal.js';

export interface RateSnapshot {
  fiatCurrency: string;
  fiatPerOneTgd: Decimal;
  capturedAt: Date;
}

export function snapshot(rate: {
  fiatCurrency: string;
  fiatPerOneTgd: string | number;
}): RateSnapshot {
  return {
    fiatCurrency: rate.fiatCurrency,
    fiatPerOneTgd: new Decimal(rate.fiatPerOneTgd),
    capturedAt: new Date(),
  };
}
