import { Decimal } from 'decimal.js';

export interface LedgerEntry {
  operation: string;
  fromAccount: number | null;
  toAccount: number;
  amount: Decimal;
  currencyCode: string;
  reference: string;
  idempotencyKey: string;
  memo?: string;
}

export interface DoubleEntryPair {
  debit: LedgerEntry;
  credit: LedgerEntry;
}

export function buildDoubleEntry(input: LedgerEntry): DoubleEntryPair {
  if (input.amount.lte(0)) {
    throw new Error('amount_must_be_positive');
  }
  if (input.fromAccount !== null && input.fromAccount === input.toAccount) {
    throw new Error('from_and_to_must_differ');
  }

  const debit: LedgerEntry = Object.freeze({
    ...input,
    fromAccount: input.fromAccount,
    toAccount: input.toAccount,
  });

  const credit: LedgerEntry = Object.freeze({
    ...input,
    fromAccount: input.toAccount,
    toAccount: input.fromAccount ?? input.toAccount,
  });

  return { debit, credit };
}

export function sumAmounts(entries: LedgerEntry[]): Decimal {
  return entries.reduce((acc, e) => acc.plus(e.amount), new Decimal(0));
}

export function assertBalanced(entries: LedgerEntry[]): void {
  const total = sumAmounts(entries);
  if (!total.equals(0) && entries.length > 1) {
    throw new Error('double_entry_unbalanced');
  }
}
