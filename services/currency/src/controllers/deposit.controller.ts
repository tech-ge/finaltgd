import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

import type { MintPipeline } from '../minting/MintPipeline.js';

const DepositSchema = z.object({
  accountId: z.number().int().positive(),
  fiatAmount: z.string().min(1),
  fiatCurrency: z.string().length(3),
  gatewayReference: z.string().min(4).max(100),
  gatewayName: z.enum(['mpesa', 'bank']),
});

export function registerDepositRoutes(app: FastifyInstance, mint: MintPipeline): void {
  app.post('/deposit', async (request, reply) => {
    const parsed = DepositSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }

    try {
      const result = await mint.run(parsed.data);
      return reply.code(201).send(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown_error';
      return reply.code(422).send({ error: message });
    }
  });
}
