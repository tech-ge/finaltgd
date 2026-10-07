import { Decimal } from 'decimal.js';

export interface LedgerEntry {
  operation: string;
  fromAccount: number | null;
  toAccount: number;
  amount: Decimal;
  reference: string;
  idempotencyKey: string;
  memo?: string;
}

export function buildDoubleEntry(input: LedgerEntry): LedgerEntry {
  if (input.amount.lte(0)) {
    throw new Error('amount_must_be_positive');
  }
  if (input.fromAccount !== null && input.fromAccount === input.toAccount) {
    throw new Error('from_and_to_must_differ');
  }
  return Object.freeze({ ...input });
}

export function sumEntries(entries: LedgerEntry[]): Decimal {
  return entries.reduce((acc, e) => acc.plus(e.amount), new Decimal(0));
}
