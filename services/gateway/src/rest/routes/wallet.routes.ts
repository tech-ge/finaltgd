import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { requireResourceAction } from '../../auth/RbacGuard.js';
import type { ProxyClient } from '../versioning/proxy.js';

const DepositSchema = z.object({
  accountId: z.number().int().positive(),
  fiatAmount: z.string().min(1),
  fiatCurrency: z.string().length(3),
  gatewayReference: z.string().min(4),
  gatewayName: z.enum(['mpesa', 'bank']),
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
      const result = await proxy.forward('currency', '/send/internal', request.body);
      return reply.code(result.status).send(result.body);
    },
  );

  app.post(
    '/v1/wallet/escrow',
    { preHandler: requireResourceAction('wallet', 'escrow') },
    async (request, reply) => {
      const result = await proxy.forward('currency', '/escrow', request.body);
      return reply.code(result.status).send(result.body);
    },
  );

  app.get(
    '/v1/wallet/balance/:accountId',
    { preHandler: requireResourceAction('wallet', 'read') },
    async (request, reply) => {
      const params = request.params as { accountId: string };
      const result = await proxy.forward('currency', `/balance/${params.accountId}`, null, 'GET');
      return reply.code(result.status).send(result.body);
    },
  );
}
