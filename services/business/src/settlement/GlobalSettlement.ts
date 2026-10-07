import { Decimal } from 'decimal.js';

export interface SettlementLeg {
  fromAccount: number;
  toAccount: number;
  amountTgd: Decimal;
  reference: string;
}

export interface SettlementBatch {
  batchId: string;
  legs: SettlementLeg[];
  createdAt: Date;
}

export function netByAccount(legs: SettlementLeg[]): Map<number, Decimal> {
  const net = new Map<number, Decimal>();
  for (const leg of legs) {
    const from = net.get(leg.fromAccount) ?? new Decimal(0);
    net.set(leg.fromAccount, from.minus(leg.amountTgd));

    const to = net.get(leg.toAccount) ?? new Decimal(0);
    net.set(leg.toAccount, to.plus(leg.amountTgd));
  }
  return net;
}

export function validate(batch: SettlementBatch): void {
  const net = netByAccount(batch.legs);
  let sum = new Decimal(0);
  for (const value of net.values()) {
    sum = sum.plus(value);
  }
  if (!sum.equals(0)) {
    throw new Error('settlement_unbalanced');
  }
}
