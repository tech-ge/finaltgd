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

export function isPositive(value: Decimal): boolean {
  return value.gt(0);
}

export function assertNonZero(value: Decimal, name: string): void {
  if (value.equals(0)) {
    throw new Error(`${name}_must_be_nonzero`);
  }
}
