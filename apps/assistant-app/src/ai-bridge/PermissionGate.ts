export interface PermissionCheck {
  scope: string;
  consented: boolean;
}

export interface PermissionVerdict {
  allowed: boolean;
  reason: string;
}

export function evaluatePermission(check: PermissionCheck): PermissionVerdict {
  if (!check.consented) {
    return { allowed: false, reason: 'consent_missing' };
  }
  return { allowed: true, reason: 'consent_present' };
}
