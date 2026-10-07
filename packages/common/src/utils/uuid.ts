import { randomUUID } from 'node:crypto';

export function uuid(): string {
  return randomUUID();
}

export function isUuid(value: string): boolean {
  const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return pattern.test(value);
}
