import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

import type { BalanceGuard } from '../ledger/BalanceGuard.js';

const ParamSchema = z.object({ accountId: z.coerce.number().int().positive() });

export function registerBalanceRoutes(app: FastifyInstance, balance: BalanceGuard): void {
  app.get('/balance/:accountId', async (request, reply) => {
    const parsed = ParamSchema.safeParse(request.params);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    try {
      const value = await balance.balanceOf(parsed.data.accountId);
      return reply.code(200).send({
        accountId: parsed.data.accountId,
        balance: value.toString(),
        currency: 'TGD',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown_error';
      return reply.code(422).send({ error: message });
    }
  });
}
