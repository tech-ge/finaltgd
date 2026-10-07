import type { Decimal } from 'decimal.js';

export interface ReleaseConditions {
  withinRadius: boolean;
  biometricOk: boolean;
  notExpired: boolean;
  amount: Decimal;
}

export interface ReleaseVerdict {
  release: boolean;
  reason: string;
}

export function evaluate(conditions: ReleaseConditions): ReleaseVerdict {
  if (!conditions.notExpired) {
    return { release: false, reason: 'escrow_expired' };
  }
  if (!conditions.biometricOk) {
    return { release: false, reason: 'biometric_required' };
  }
  if (!conditions.withinRadius) {
    return { release: false, reason: 'release_outside_radius' };
  }
  return { release: true, reason: 'conditions_satisfied' };
}

export function canRelease(conditions: ReleaseConditions): boolean {
  return evaluate(conditions).release;
}
