import { createHmac, timingSafeEqual } from 'node:crypto';

export interface BiometricToken {
  accountId: number;
  deviceFingerprint: string;
  issuedAt: number;
  signature: string;
}

export function computeBiometricSignature(
  accountId: number,
  deviceFingerprint: string,
  issuedAt: number,
  secret: string,
): string {
  const payload = `${accountId}:${deviceFingerprint}:${issuedAt}`;
  return createHmac('sha256', secret).update(payload).digest('hex');
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
  if (token.issuedAt > now + 5_000) {
    return false;
  }

  const expected = computeBiometricSignature(
    token.accountId,
    token.deviceFingerprint,
    token.issuedAt,
    secret,
  );

  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(token.signature, 'hex');
  if (a.length !== b.length) {
    return false;
  }
  return timingSafeEqual(a, b);
}
