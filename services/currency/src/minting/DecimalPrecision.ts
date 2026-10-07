import { Decimal } from 'decimal.js';

Decimal.set({ precision: 28, rounding: Decimal.ROUND_HALF_UP });

export function toTgd(value: string | number | Decimal): Decimal {
  return new Decimal(value).toDecimalPlaces(4, Decimal.ROUND_HALF_UP);
}

export function toFiat(value: string | number | Decimal): Decimal {
  return new Decimal(value).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
}

export function safeAdd(a: Decimal, b: Decimal): Decimal {
  return a.plus(b);
}

export function safeSub(a: Decimal, b: Decimal): Decimal {
  return a.minus(b);
}
