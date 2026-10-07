import type { Role, SessionClaims } from '../jwt.js';

export interface GuardContext {
  claims: SessionClaims | null;
}

export interface GuardResult {
  allowed: boolean;
  reason?: string;
}

export function requireBusiness(context: GuardContext): GuardResult {
  if (!context.claims) {
    return { allowed: false, reason: 'unauthenticated' };
  }
  if (context.claims.role !== 'BUSINESS') {
    return { allowed: false, reason: 'business_required' };
  }
  return { allowed: true };
}

export function assertBusiness(role: Role): void {
  if (role !== 'BUSINESS') {
    throw new Error('business_required');
  }
}
