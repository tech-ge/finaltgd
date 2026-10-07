import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

import type { P2PTransfer } from '../transfers/P2PTransfer.js';
import type { B2BTransfer } from '../transfers/B2BTransfer.js';
import type { B2CTransfer } from '../transfers/B2CTransfer.js';

const SendSchema = z.object({
  fromAccount: z.number().int().positive(),
  toAccount: z.number().int().positive(),
  amount: z.string().min(1),
  idempotencyKey: z.string().min(8).max(100),
  memo: z.string().max(500).optional(),
});

export interface SendDependencies {
  p2p: P2PTransfer;
  b2b: B2BTransfer;
  b2c: B2CTransfer;
}

export function registerSendRoutes(app: FastifyInstance, deps: SendDependencies): void {
  app.post('/send/internal', async (request, reply) => {
    const parsed = SendSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    try {
      const result = await deps.p2p.run(parsed.data);
      return reply.code(200).send(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown_error';
      return reply.code(422).send({ error: message });
    }
  });

  app.post('/send/b2b', async (request, reply) => {
    const parsed = SendSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    try {
      const result = await deps.b2b.run({
        fromBusinessAccount: parsed.data.fromAccount,
        toBusinessAccount: parsed.data.toAccount,
        amount: parsed.data.amount,
        idempotencyKey: parsed.data.idempotencyKey,
        memo: parsed.data.memo,
      });
      return reply.code(200).send(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown_error';
      return reply.code(422).send({ error: message });
    }
  });

  app.post('/send/b2c', async (request, reply) => {
    const parsed = SendSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    try {
      const result = await deps.b2c.run({
        fromBusinessAccount: parsed.data.fromAccount,
        toUserAccount: parsed.data.toAccount,
        amount: parsed.data.amount,
        idempotencyKey: parsed.data.idempotencyKey,
        memo: parsed.data.memo,
      });
      return reply.code(200).send(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown_error';
      return reply.code(422).send({ error: message });
    }
  });
}
