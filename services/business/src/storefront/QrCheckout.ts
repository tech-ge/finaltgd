import { createHmac, randomBytes } from 'node:crypto';

export interface QrPayload {
  storefrontSlug: string;
  businessAccountId: number;
  amountTgd: string;
  reference: string;
  issuedAt: number;
}

export function buildQrPayload(input: {
  storefrontSlug: string;
  businessAccountId: number;
  amountTgd: string;
  ttlSeconds: number;
}): QrPayload {
  return {
    storefrontSlug: input.storefrontSlug,
    businessAccountId: input.businessAccountId,
    amountTgd: input.amountTgd,
    reference: randomBytes(12).toString('hex'),
    issuedAt: Date.now(),
  };
}

export function signQrPayload(payload: QrPayload, secret: string): string {
  const canonical = [
    payload.storefrontSlug,
    String(payload.businessAccountId),
    payload.amountTgd,
    payload.reference,
    String(payload.issuedAt),
  ].join('|');
  return createHmac('sha256', secret).update(canonical).digest('hex');
}

export function isExpired(payload: QrPayload, ttlSeconds: number, now = Date.now()): boolean {
  return now - payload.issuedAt > ttlSeconds * 1000;
}
