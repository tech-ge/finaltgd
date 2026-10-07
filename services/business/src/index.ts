import Fastify from 'fastify';
import { Decimal } from 'decimal.js';
import { Pool } from 'pg';
import { z } from 'zod';

import { CustomerReach } from './geo-marketing/CustomerReach.js';
import { estimate as estimateReach } from './geo-marketing/CustomerReach.js';
import { match as matchOffers } from './geo-marketing/LocalOfferEngine.js';
import type { Campaign } from './geo-marketing/GeoFenceCampaign.js';
import { validate as validateCampaign } from './geo-marketing/GeoFenceCampaign.js';
import { aggregate } from './heatmaps/FootTrafficAggregator.js';
import { generate } from './heatmaps/HeatmapGenerator.js';
import { analyze as analyzeTime } from './heatmaps/TimeOfDayAnalyzer.js';
import { forecast } from './inventory-ai/DemandForecast.js';
import { project } from './inventory-ai/PredictiveStock.js';
import { decide } from './inventory-ai/ReorderEngine.js';
import { compare as compareFx } from './settlement/FxFeeEliminator.js';
import { net as netCrossBorder } from './settlement/CrossBorderNetting.js';
import { ProductCatalog } from './storefront/ProductCatalog.js';
import { buildQrPayload, isExpired, signQrPayload } from './storefront/QrCheckout.js';
import { StorefrontService } from './storefront/StorefrontService.js';
import { TgdAcceptor } from './storefront/TgdAcceptor.js';

interface Env {
  NODE_ENV: string;
  SERVICE_NAME: string;
  PORT: number;
  LOG_LEVEL: string;
  POSTGRES_URL: string;
  JWT_SECRET: string;
}

function loadEnv(): Env {
  const schema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    SERVICE_NAME: z.string().default('business'),
    PORT: z.coerce.number().int().positive().default(3007),
    LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
    POSTGRES_URL: z.string().min(1),
    JWT_SECRET: z.string().min(32),
  });
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`invalid_environment: ${issues}`);
  }
  return parsed.data;
}

async function main(): Promise<void> {
  const env = loadEnv();
  const pool = new Pool({ connectionString: env.POSTGRES_URL, max: 20 });

  const storefrontService = new StorefrontService(pool);
  const catalog = new ProductCatalog();
  const acceptor = new TgdAcceptor();

  void CustomerReach;

  const app = Fastify({ logger: { level: env.LOG_LEVEL } });

  app.get('/health', async () => ({ status: 'ok' }));
  app.get('/version', async () => ({
    service: env.SERVICE_NAME,
    version: '0.1.0',
    env: env.NODE_ENV,
  }));

  app.post('/storefront', async (request, reply) => {
    const schema = z.object({
      businessId: z.number().int().positive(),
      slug: z.string().min(3).max(80),
      displayName: z.string().min(1).max(120),
    });
    const parsed = schema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    try {
      const id = await storefrontService.create(parsed.data);
      return reply.code(201).send({ storefrontId: id });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown_error';
      return reply.code(422).send({ error: message });
    }
  });

  app.post('/storefront/publish', async (request, reply) => {
    const schema = z.object({ slug: z.string().min(3) });
    const parsed = schema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    await storefrontService.publish(parsed.data.slug);
    return reply.code(200).send({ published: true });
  });

  app.post('/storefront/product', async (request, reply) => {
    const schema = z.object({
      id: z.string().min(1),
      storefrontSlug: z.string().min(1),
      name: z.string().min(1),
      description: z.string().default(''),
      priceTgd: z.string().min(1),
    });
    const parsed = schema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    try {
      catalog.add({
        id: parsed.data.id,
        storefrontSlug: parsed.data.storefrontSlug,
        name: parsed.data.name,
        description: parsed.data.description,
        priceTgd: new Decimal(parsed.data.priceTgd),
        isActive: true,
      });
      return reply.code(201).send({ added: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown_error';
      return reply.code(422).send({ error: message });
    }
  });

  app.get('/storefront/:slug/products', async (request, reply) => {
    const schema = z.object({ slug: z.string().min(1) });
    const parsed = schema.safeParse(request.params);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    const products = catalog.listFor(parsed.data.slug);
    return reply.code(200).send({
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        priceTgd: p.priceTgd.toString(),
      })),
    });
  });

  app.post('/qr/build', async (request, reply) => {
    const schema = z.object({
      storefrontSlug: z.string().min(1),
      businessAccountId: z.number().int().positive(),
      amountTgd: z.string().min(1),
      ttlSeconds: z.number().int().positive().default(120),
    });
    const parsed = schema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }

    const payload = buildQrPayload({
      storefrontSlug: parsed.data.storefrontSlug,
      businessAccountId: parsed.data.businessAccountId,
      amountTgd: parsed.data.amountTgd,
      ttlSeconds: parsed.data.ttlSeconds,
    });
    const signature = signQrPayload(payload, env.JWT_SECRET);
    return reply.code(200).send({ payload, signature, expired: isExpired(payload, parsed.data.ttlSeconds) });
  });

  app.post('/payment/intent', async (request, reply) => {
    const schema = z.object({
      businessAccountId: z.number().int().positive(),
      customerAccountId: z.number().int().positive(),
      amountTgd: z.string().min(1),
      idempotencyKey: z.string().min(8).max(100),
      reference: z.string().min(4).max(120),
    });
    const parsed = schema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }

    const outcome = await acceptor.validate({
      businessAccountId: parsed.data.businessAccountId,
      customerAccountId: parsed.data.customerAccountId,
      amountTgd: new Decimal(parsed.data.amountTgd),
      idempotencyKey: parsed.data.idempotencyKey,
      reference: parsed.data.reference,
    });

    return reply.code(outcome.accepted ? 200 : 422).send(outcome);
  });

  app.post('/heatmap', async (request, reply) => {
    const schema = z.object({
      events: z.array(
        z.object({
          businessId: z.number().int().positive(),
          lat: z.number(),
          lon: z.number(),
          observedAt: z.string(),
        }),
      ),
    });
    const parsed = schema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }

    const events = parsed.data.events.map((e) => ({
      businessId: e.businessId,
      lat: e.lat,
      lon: e.lon,
      observedAt: new Date(e.observedAt),
    }));

    const cells = aggregate(events);
    const heatmap = generate(cells);
    const profile = analyzeTime(events);

    return reply.code(200).send({ heatmap, profile });
  });

  app.post('/inventory/forecast', async (request, reply) => {
    const schema = z.object({
      productId: z.string().min(1),
      historicalSales: z.array(z.number().nonnegative()),
      horizonDays: z.number().int().positive(),
      currentStock: z.number().int().nonnegative(),
      reorderLeadDays: z.number().int().nonnegative(),
    });
    const parsed = schema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }

    const demand = forecast({
      productId: parsed.data.productId,
      historicalSales: parsed.data.historicalSales,
      horizonDays: parsed.data.horizonDays,
    });

    const projection = project(
      {
        productId: parsed.data.productId,
        currentStock: parsed.data.currentStock,
        reorderLeadDays: parsed.data.reorderLeadDays,
      },
      demand,
    );

    const decision = decide(projection);

    return reply.code(200).send({ demand, projection, decision });
  });

  app.post('/geo/offers', async (request, reply) => {
    const schema = z.object({
      campaigns: z.array(
        z.object({
          id: z.string().min(1),
          businessId: z.number().int().positive(),
          centerLat: z.number(),
          centerLon: z.number(),
          radiusMeters: z.number().positive(),
          message: z.string().min(1),
          startsAt: z.string(),
          endsAt: z.string(),
        }),
      ),
      customerLat: z.number(),
      customerLon: z.number(),
    });
    const parsed = schema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }

    const campaigns: Campaign[] = parsed.data.campaigns.map((c) => ({
      id: c.id,
      businessId: c.businessId,
      centerLat: c.centerLat,
      centerLon: c.centerLon,
      radiusMeters: c.radiusMeters,
      message: c.message,
      startsAt: new Date(c.startsAt),
      endsAt: new Date(c.endsAt),
    }));

    try {
      campaigns.forEach(validateCampaign);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown_error';
      return reply.code(422).send({ error: message });
    }

    const offers = matchOffers(campaigns, parsed.data.customerLat, parsed.data.customerLon);
    return reply.code(200).send({ offers });
  });

  app.post('/settlement/net', async (request, reply) => {
    const schema = z.object({
      payments: z.array(
        z.object({
          fromBusinessAccount: z.number().int().positive(),
          toBusinessAccount: z.number().int().positive(),
          amountTgd: z.string().min(1),
          currencyPair: z.string().min(3),
        }),
      ),
    });
    const parsed = schema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }

    const result = netCrossBorder(
      parsed.data.payments.map((p) => ({
        fromBusinessAccount: p.fromBusinessAccount,
        toBusinessAccount: p.toBusinessAccount,
        amountTgd: new Decimal(p.amountTgd),
        currencyPair: p.currencyPair,
      })),
    );

    return reply.code(200).send(result);
  });

  app.post('/settlement/fx-compare', async (request, reply) => {
    const schema = z.object({
      corridor: z.string().min(3),
      amountTgd: z.string().min(1),
    });
    const parsed = schema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }

    const comparison = compareFx(parsed.data.corridor, new Decimal(parsed.data.amountTgd));
    return reply.code(200).send({
      corridor: comparison.corridor,
      legacyFeePercent: comparison.legacyFeePercent,
      techgeoFeePercent: comparison.techgeoFeePercent,
      estimatedSavings: comparison.estimatedSavings.toString(),
      amountTgd: comparison.amountTgd.toString(),
    });
  });

  const shutdown = async (): Promise<void> => {
    await app.close();
    await pool.end();
    process.exit(0);
  };

  process.on('SIGINT', () => void shutdown());
  process.on('SIGTERM', () => void shutdown());

  await app.listen({ host: '0.0.0.0', port: env.PORT });
}

main().catch((err) => {
  console.error('fatal_startup_error', err);
  process.exit(1);
});
