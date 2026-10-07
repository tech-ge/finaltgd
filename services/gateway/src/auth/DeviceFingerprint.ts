import { createHmac, timingSafeEqual } from 'node:crypto';

export interface FingerprintInput {
  hardwareId: string;
  osVersion: string;
  appInstallId: string;
  screenClass: string;
}

export function computeFingerprint(input: FingerprintInput, salt: string): string {
  const canonical = [
    input.hardwareId,
    input.osVersion,
    input.appInstallId,
    input.screenClass,
  ].join('|');
  return createHmac('sha256', salt).update(canonical).digest('hex');
}

export function fingerprintsMatch(expected: string, observed: string): boolean {
  if (expected.length !== observed.length) {
    return false;
  }
  try {
    const a = Buffer.from(expected, 'hex');
    const b = Buffer.from(observed, 'hex');
    if (a.length !== b.length) {
      return false;
    }
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
