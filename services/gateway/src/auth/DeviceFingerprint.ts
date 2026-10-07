import { createHmac, timingSafeEqual } from 'node:crypto';

export interface FingerprintHeaders {
  hardware: string;
  osVersion: string;
  installId: string;
  screenClass: string;
}

export function computeFingerprint(
  headers: FingerprintHeaders,
  salt: string,
): string {
  const canonical = [headers.hardware, headers.osVersion, headers.installId, headers.screenClass].join('|');
  return createHmac('sha256', salt).update(canonical).digest('hex');
}

export function fingerprintMatches(
  expected: string,
  observed: string,
): boolean {
  if (expected.length !== observed.length) {
    return false;
  }
  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(observed, 'hex');
  if (a.length !== b.length) {
    return false;
  }
  return timingSafeEqual(a, b);
}
