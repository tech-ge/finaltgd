export type Scope =
  | 'balance.read'
  | 'activity.read'
  | 'location.read'
  | 'microphone.read'
  | 'health.read'
  | 'business.read'
  | 'call.history.read';

export interface ScopeGrant {
  scope: Scope;
  grantedAt: Date;
  expiresAt: Date;
}

const DEFAULT_TTL_MS = 60_000;

export function grant(scope: Scope, ttlMs = DEFAULT_TTL_MS): ScopeGrant {
  const now = new Date();
  return {
    scope,
    grantedAt: now,
    expiresAt: new Date(now.getTime() + ttlMs),
  };
}

export function isActive(grant: ScopeGrant, now = new Date()): boolean {
  return now <= grant.expiresAt;
}
