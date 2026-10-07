import type { FastifyReply, FastifyRequest } from 'fastify';

import type { Role, SessionClaims } from './JwtVerifier.js';

export const ROLE_MATRIX: Record<string, Record<string, Role[]>> = {
  wallet: {
    deposit: ['USER', 'BUSINESS'],
    send: ['USER', 'BUSINESS'],
    escrow: ['USER', 'BUSINESS'],
    read: ['USER', 'BUSINESS', 'ADMIN', 'CEO'],
  },
  attendance: {
    checkin: ['WORKER', 'SUPERVISOR', 'ADMIN', 'CEO'],
    monitor: ['SUPERVISOR', 'ADMIN', 'CEO'],
  },
  admin: {
    manage: ['ADMIN', 'CEO'],
    read: ['ADMIN', 'CEO', 'SUPERVISOR'],
  },
  ai: {
    invoke: ['USER', 'BUSINESS'],
  },
  assistant: {
    invoke: ['USER'],
  },
  business: {
    manage: ['BUSINESS'],
    read: ['BUSINESS', 'USER'],
  },
  health: {
    read: ['USER'],
  },
};

export function isAllowed(role: Role, resource: string, action: string): boolean {
  const allowed = ROLE_MATRIX[resource]?.[action];
  if (!allowed) {
    return false;
  }
  return allowed.includes(role);
}

export function requireResourceAction(resource: string, action: string) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const claims = (request as FastifyRequest & { claims?: SessionClaims }).claims;
    if (!claims) {
      await reply.code(401).send({ error: 'unauthenticated' });
      return;
    }
    if (!isAllowed(claims.role, resource, action)) {
      await reply.code(403).send({ error: 'forbidden' });
    }
  };
}
