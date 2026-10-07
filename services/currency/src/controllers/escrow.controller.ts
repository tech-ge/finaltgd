import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

import type { EscrowService } from '../escrow/EscrowService.js';

const CreateSchema = z.object({
  fromAccount: z.number().int().positive(),
  toAccount: z.number().int().positive(),
  amount: z.string().min(1),
  reference: z.string().min(4).max(100),
  idempotencyKey: z.string().min(8).max(100),
  releaseLat: z.number().optional(),
  releaseLon: z.number().optional(),
  releaseRadiusM: z.number().int().positive().optional(),
  expiresInHours: z.number().int().positive().optional(),
});

const ReleaseSchema = z.object({
  escrowId: z.number().int().positive(),
  releaseLat: z.number(),
  releaseLon: z.number(),
  biometricOk: z.boolean(),
  idempotencyKey: z.string().min(8).max(100),
});

export function registerEscrowRoutes(app: FastifyInstance, escrow: EscrowService): void {
  app.post('/escrow', async (request, reply) => {
    const parsed = CreateSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    try {
      const escrowId = await escrow.create(parsed.data);
      return reply.code(201).send({ escrowId });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown_error';
      return reply.code(422).send({ error: message });
    }
  });

  app.post('/escrow/release', async (request, reply) => {
    const parsed = ReleaseSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    try {
      const id = await escrow.release(parsed.data);
      return reply.code(200).send({ escrowId: id });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown_error';
      return reply.code(422).send({ error: message });
    }
  });
}
