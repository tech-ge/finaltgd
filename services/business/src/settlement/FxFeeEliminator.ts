import { Decimal } from 'decimal.js';

export interface FeeComparison {
  corridor: string;
  legacyFeePercent: number;
  techgeoFeePercent: number;
  estimatedSavings: Decimal;
  amountTgd: Decimal;
}

const LEGACY_FEE_BY_CORRIDOR: Record<string, number> = {
  'KES-USD': 0.038,
  'KES-EUR': 0.041,
  'KES-GBP': 0.044,
  'KES-UGX': 0.029,
  'KES-TZS': 0.027,
};

export function compare(corridor: string, amountTgd: Decimal): FeeComparison {
  const legacyFeePercent = LEGACY_FEE_BY_CORRIDOR[corridor] ?? 0.035;
  const techgeoFeePercent = 0;
  const legacyFee = amountTgd.times(legacyFeePercent);
  const techgeoFee = amountTgd.times(techgeoFeePercent);
  const savings = legacyFee.minus(techgeoFee);

  return {
    corridor,
    legacyFeePercent,
    techgeoFeePercent,
    estimatedSavings: savings.toDecimalPlaces(4),
    amountTgd,
  };
}
