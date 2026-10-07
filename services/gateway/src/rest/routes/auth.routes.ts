import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { computeFingerprint } from '../../auth/DeviceFingerprint.js';
import type { JwtVerifier } from '../../auth/JwtVerifier.js';
import type { SessionStore } from '../../auth/SessionStore.js';

export interface AuthDeps {
  jwt: JwtVerifier;
  sessions: SessionStore;
  fingerprintSalt: string;
  expiresIn: string;
}

const LoginSchema = z.object({
  accountId: z.number().int().positive(),
  role: z.enum(['CEO', 'ADMIN', 'SUPERVISOR', 'WORKER', 'BUSINESS', 'USER']),
  orgId: z.number().int().positive().optional(),
  hardware: z.string().min(1),
  osVersion: z.string().min(1),
  installId: z.string().min(1),
  screenClass: z.string().min(1),
});

export async function registerAuthRoutes(app: FastifyInstance, deps: AuthDeps): Promise<void> {
  app.post('/v1/auth/login', async (request, reply) => {
    const parsed = LoginSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }

    const fingerprint = computeFingerprint(
      {
        hardware: parsed.data.hardware,
        osVersion: parsed.data.osVersion,
        installId: parsed.data.installId,
        screenClass: parsed.data.screenClass,
      },
      deps.fingerprintSalt,
    );

    const jti = `${parsed.data.accountId}:${Date.now()}`;
    const token = await deps.jwt.sign(
      {
        sub: String(parsed.data.accountId),
        role: parsed.data.role,
        orgId: parsed.data.orgId,
        deviceFingerprint: fingerprint,
      },
      deps.expiresIn,
    );

    await deps.sessions.put(jti, {
      sub: String(parsed.data.accountId),
      role: parsed.data.role,
      orgId: parsed.data.orgId,
      deviceFingerprint: fingerprint,
    });

    return reply.code(200).send({ token, jti, fingerprint });
  });

  app.post('/v1/auth/logout', async (request, reply) => {
    const body = z.object({ jti: z.string().min(1) }).safeParse(request.body);
    if (!body.success) {
      return reply.code(400).send({ error: 'invalid_request' });
    }
    await deps.sessions.revoke(body.data.jti);
    return reply.code(200).send({ revoked: true });
  });
}
