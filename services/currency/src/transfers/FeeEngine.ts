import { Decimal } from 'decimal.js';

export interface FeePolicy {
  internalFeeBps: number;
  businessFeeBps: number;
  minFee: Decimal;
  maxFee: Decimal;
}

export const DEFAULT_FEE_POLICY: FeePolicy = {
  internalFeeBps: 0,
  businessFeeBps: 0,
  minFee: new Decimal(0),
  maxFee: new Decimal(0),
};

export function computeFee(amount: Decimal, policy: FeePolicy, isBusiness: boolean): Decimal {
  const bps = isBusiness ? policy.businessFeeBps : policy.internalFeeBps;
  if (bps === 0) {
    return new Decimal(0);
  }
  const raw = amount.times(bps).dividedBy(10_000);
  return Decimal.max(policy.minFee, Decimal.min(policy.maxFee, raw)).toDecimalPlaces(4);
}
