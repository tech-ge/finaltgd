import { createHmac, timingSafeEqual } from 'node:crypto';

export interface BiometricToken {
  accountId: number;
  deviceFingerprint: string;
  issuedAt: number;
  signature: string;
}

export function verifyBiometricToken(
  token: BiometricToken,
  secret: string,
  maxAgeMs = 60_000,
): boolean {
  const now = Date.now();
  if (now - token.issuedAt > maxAgeMs) {
    return false;
  }

  const payload = `${token.accountId}:${token.deviceFingerprint}:${token.issuedAt}`;
  const expected = createHmac('sha256', secret).update(payload).digest('hex');

  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(token.signature, 'hex');

  if (a.length !== b.length) {
    return false;
  }
  return timingSafeEqual(a, b);
}
