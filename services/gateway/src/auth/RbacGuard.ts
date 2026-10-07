import type { FastifyReply, FastifyRequest } from 'fastify';

import type { SessionClaims } from './JwtVerifier.js';

export type Role = SessionClaims['role'];

export interface RoleMatrix {
  [resource: string]: {
    [action: string]: Role[];
  };
}

export const MATRIX: RoleMatrix = {
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

export function assertRole(roles: Role[], required: Role[]): void {
  if (!required.some((r) => roles.includes(r))) {
    throw new Error('role_not_permitted');
  }
}

export function requireResourceAction(resource: string, action: string) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const claims = (request as FastifyRequest & { claims?: SessionClaims }).claims;
    if (!claims) {
      await reply.code(401).send({ error: 'unauthenticated' });
      return;
    }
    const allowed = MATRIX[resource]?.[action];
    if (!allowed) {
      await reply.code(403).send({ error: 'unknown_permission' });
      return;
    }
    if (!allowed.includes(claims.role)) {
      await reply.code(403).send({ error: 'forbidden' });
    }
  };
}
