export interface ReleaseConditions {
  withinRadius: boolean;
  biometricOk: boolean;
  notExpired: boolean;
}

export function canRelease(conditions: ReleaseConditions): boolean {
  return conditions.withinRadius && conditions.biometricOk && conditions.notExpired;
}

export function reasonForRefusal(conditions: ReleaseConditions): string | null {
  if (!conditions.withinRadius) {
    return 'release_outside_radius';
  }
  if (!conditions.biometricOk) {
    return 'biometric_required';
  }
  if (!conditions.notExpired) {
    return 'escrow_expired';
  }
  return null;
}
