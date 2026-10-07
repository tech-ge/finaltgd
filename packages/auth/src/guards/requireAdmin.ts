import type { Role, SessionClaims } from '../jwt.js';

export interface GuardContext {
  claims: SessionClaims | null;
}

export interface GuardResult {
  allowed: boolean;
  reason?: string;
}

export function requireAdmin(context: GuardContext): GuardResult {
  if (!context.claims) {
    return { allowed: false, reason: 'unauthenticated' };
  }
  if (context.claims.role !== 'ADMIN' && context.claims.role !== 'CEO') {
    return { allowed: false, reason: 'admin_or_higher_required' };
  }
  return { allowed: true };
}

export function assertAdmin(role: Role): void {
  if (role !== 'ADMIN' && role !== 'CEO') {
    throw new Error('admin_or_higher_required');
  }
}
