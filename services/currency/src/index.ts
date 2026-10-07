import Fastify from 'fastify';
import { Redis } from 'ioredis';
import { Pool } from 'pg';

import { loadEnv } from './config/env.js';
import { registerBalanceRoutes } from './controllers/balance.controller.js';
import { registerDepositRoutes } from './controllers/deposit.controller.js';
import { registerEscrowRoutes } from './controllers/escrow.controller.js';
import { registerRateRoutes } from './controllers/rate.controller.js';
import { registerSendRoutes } from './controllers/send.controller.js';
import { EscrowService } from './escrow/EscrowService.js';
import { BalanceGuard } from './ledger/BalanceGuard.js';
import { LedgerService } from './ledger/LedgerService.js';
import { MintPipeline } from './minting/MintPipeline.js';
import { DepositRepo } from './repositories/DepositRepo.js';
import { EscrowRepo } from './repositories/EscrowRepo.js';
import { LedgerRepo } from './repositories/LedgerRepo.js';
import { RateRepo } from './repositories/RateRepo.js';
import { B2BTransfer } from './transfers/B2BTransfer.js';
import { B2CTransfer } from './transfers/B2CTransfer.js';
import { P2PTransfer } from './transfers/P2PTransfer.js';

async function main(): Promise<void> {
  const env = loadEnv();

  const pool = new Pool({ connectionString: env.POSTGRES_URL, max: 20 });
  const ledgerRedis = new Redis(env.REDIS_LEDGER_URL);

  const ledger = new LedgerService(pool, ledgerRedis);
  const mint = new MintPipeline(pool);
  const escrow = new EscrowService(pool);
  const balance = new BalanceGuard(pool);
  const rateRepo = new RateRepo(pool);
  const depositRepo = new DepositRepo(pool);
  const escrowRepo = new EscrowRepo(pool);
  const ledgerRepo = new LedgerRepo(pool);

  void depositRepo;
  void escrowRepo;
  void ledgerRepo;

  const p2p = new P2PTransfer(ledger);
  const b2b = new B2BTransfer(ledger);
  const b2c = new B2CTransfer(ledger);

  const app = Fastify({ logger: { level: env.LOG_LEVEL } });

  app.get('/health', async () => ({ status: 'ok' }));
  app.get('/version', async () => ({
    service: env.SERVICE_NAME,
    version: '0.1.0',
    env: env.NODE_ENV,
  }));

  registerDepositRoutes(app, mint);
  registerSendRoutes(app, { p2p, b2b, b2c });
  registerEscrowRoutes(app, escrow);
  registerBalanceRoutes(app, balance);
  registerRateRoutes(app, rateRepo);

  const shutdown = async (): Promise<void> => {
    await app.close();
    await ledgerRedis.quit();
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
