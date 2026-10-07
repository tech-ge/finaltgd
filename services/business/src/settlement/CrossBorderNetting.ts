import { Decimal } from 'decimal.js';

export interface CrossBorderPayment {
  fromBusinessAccount: number;
  toBusinessAccount: number;
  amountTgd: Decimal;
  currencyPair: string;
}

export interface NettingResult {
  netted: Array<{
    fromAccount: number;
    toAccount: number;
    amountTgd: string;
  }>;
}

export function net(payments: CrossBorderPayment[]): NettingResult {
  const pairs = new Map<string, Decimal>();

  for (const p of payments) {
    const [a, b] = [p.fromBusinessAccount, p.toBusinessAccount].sort((x, y) => x - y);
    const key = `${a}:${b}`;
    const existing = pairs.get(key) ?? new Decimal(0);

    if (p.fromBusinessAccount === a) {
      pairs.set(key, existing.plus(p.amountTgd));
    } else {
      pairs.set(key, existing.minus(p.amountTgd));
    }
  }

  const netted: NettingResult['netted'] = [];
  for (const [key, value] of pairs.entries()) {
    if (value.abs().lte(0)) {
      continue;
    }
    const [aRaw, bRaw] = key.split(':');
    const a = Number.parseInt(aRaw ?? '0', 10);
    const b = Number.parseInt(bRaw ?? '0', 10);

    if (value.gt(0)) {
      netted.push({ fromAccount: a, toAccount: b, amountTgd: value.toString() });
    } else {
      netted.push({ fromAccount: b, toAccount: a, amountTgd: value.abs().toString() });
    }
  }

  return { netted };
}
