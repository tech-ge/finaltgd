import type { Role, SessionClaims } from '../jwt.js';

export interface GuardContext {
  claims: SessionClaims | null;
}

export interface GuardResult {
  allowed: boolean;
  reason?: string;
}

export function requireCeo(context: GuardContext): GuardResult {
  if (!context.claims) {
    return { allowed: false, reason: 'unauthenticated' };
  }
  if (context.claims.role !== 'CEO') {
    return { allowed: false, reason: 'ceo_required' };
  }
  return { allowed: true };
}

export function assertCeo(role: Role): void {
  if (role !== 'CEO') {
    throw new Error('ceo_required');
  }
}
