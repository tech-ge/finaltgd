import type { Role, SessionClaims } from '../jwt.js';

export interface GuardContext {
  claims: SessionClaims | null;
}

export interface GuardResult {
  allowed: boolean;
  reason?: string;
}

export function requireSupervisor(context: GuardContext): GuardResult {
  if (!context.claims) {
    return { allowed: false, reason: 'unauthenticated' };
  }
  const role = context.claims.role;
  if (role !== 'SUPERVISOR' && role !== 'ADMIN' && role !== 'CEO') {
    return { allowed: false, reason: 'supervisor_or_higher_required' };
  }
  return { allowed: true };
}

export function assertSupervisor(role: Role): void {
  if (role !== 'SUPERVISOR' && role !== 'ADMIN' && role !== 'CEO') {
    throw new Error('supervisor_or_higher_required');
  }
}
