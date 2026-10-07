import type { Role, SessionClaims } from '../jwt.js';

export interface GuardContext {
  claims: SessionClaims | null;
}

export interface GuardResult {
  allowed: boolean;
  reason?: string;
}

export function requireWorker(context: GuardContext): GuardResult {
  if (!context.claims) {
    return { allowed: false, reason: 'unauthenticated' };
  }
  const role = context.claims.role;
  if (role !== 'WORKER' && role !== 'SUPERVISOR' && role !== 'ADMIN' && role !== 'CEO') {
    return { allowed: false, reason: 'worker_or_higher_required' };
  }
  return { allowed: true };
}

export function assertWorker(role: Role): void {
  if (role !== 'WORKER' && role !== 'SUPERVISOR' && role !== 'ADMIN' && role !== 'CEO') {
    throw new Error('worker_or_higher_required');
  }
}
