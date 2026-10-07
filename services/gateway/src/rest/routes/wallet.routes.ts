import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { requireResourceAction } from '../../auth/RbacGuard.js';
import type { ProxyClient } from '../versioning/proxy.js';

const DepositSchema = z.object({
  accountId: z.number().int().positive(),
  fiatAmount: z.string().min(1),
  fiatCurrency: z.string().length(3),
  gatewayReference: z.string().min(4).max(100),
  gatewayName: z.enum(['mpesa', 'bank']),
});

const SendSchema = z.object({
  fromAccount: z.number().int().positive(),
  toAccount: z.number().int().positive(),
  amount: z.string().min(1),
  idempotencyKey: z.string().min(8).max(100),
  memo: z.string().max(500).optional(),
});

const EscrowSchema = z.object({
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

export async function registerWalletRoutes(
  app: FastifyInstance,
  proxy: ProxyClient,
): Promise<void> {
  app.post(
    '/v1/wallet/deposit',
    { preHandler: requireResourceAction('wallet', 'deposit') },
    async (request, reply) => {
      const parsed = DepositSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
      }
      const result = await proxy.forward('currency', '/deposit', parsed.data);
      return reply.code(result.status).send(result.body);
    },
  );

  app.post(
    '/v1/wallet/send',
    { preHandler: requireResourceAction('wallet', 'send') },
    async (request, reply) => {
      const parsed = SendSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
      }
      const result = await proxy.forward('currency', '/send/internal', parsed.data);
      return reply.code(result.status).send(result.body);
    },
  );

  app.post(
    '/v1/wallet/escrow',
    { preHandler: requireResourceAction('wallet', 'escrow') },
    async (request, reply) => {
      const parsed = EscrowSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
      }
      const result = await proxy.forward('currency', '/escrow', parsed.data);
      return reply.code(result.status).send(result.body);
    },
  );

  app.get(
    '/v1/wallet/balance/:accountId',
    { preHandler: requireResourceAction('wallet', 'read') },
    async (request, reply) => {
      const params = z
        .object({ accountId: z.coerce.number().int().positive() })
        .safeParse(request.params);
      if (!params.success) {
        return reply.code(400).send({ error: 'invalid_request' });
      }
      const result = await proxy.forward(
        'currency',
        `/balance/${params.data.accountId}`,
        null,
        'GET',
      );
      return reply.code(result.status).send(result.body);
    },
  );
}
