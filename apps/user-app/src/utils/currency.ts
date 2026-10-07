export function asTgdString(value: string | number): string {
  const numeric = typeof value === 'number' ? value : Number.parseFloat(value);
  if (!Number.isFinite(numeric)) {
    throw new Error('invalid_amount');
  }
  return numeric.toFixed(4);
}

export function isPositiveAmount(value: string): boolean {
  const numeric = Number.parseFloat(value);
  return Number.isFinite(numeric) && numeric > 0;
}
