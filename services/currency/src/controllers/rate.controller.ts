import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

import type { RateRepo } from '../repositories/RateRepo.js';

const ParamSchema = z.object({ code: z.string().length(3) });

export function registerRateRoutes(app: FastifyInstance, repo: RateRepo): void {
  app.get('/rate/:code', async (request, reply) => {
    const parsed = ParamSchema.safeParse(request.params);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    const rows = await repo.listActive();
    const match = rows.find((r) => r.fiat_currency_code === parsed.data.code.toUpperCase());
    if (!match) {
      return reply.code(404).send({ error: 'rate_not_found' });
    }
    return reply.code(200).send({
      fiatCurrency: match.fiat_currency_code,
      fiatPerOneTgd: match.fiat_per_one_tgd,
      lastUpdated: match.last_updated,
    });
  });

  app.get('/rate', async (_request, reply) => {
    const rows = await repo.listActive();
    return reply.code(200).send({
      rates: rows.map((r) => ({
        fiatCurrency: r.fiat_currency_code,
        fiatPerOneTgd: r.fiat_per_one_tgd,
        lastUpdated: r.last_updated,
      })),
    });
  });
}
