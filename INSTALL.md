# TechGeo Installation Checklist

Reference only. Do not run until dependencies are installed and
environment values are set. Every step is manual and reviewable.

## 0. Prerequisites

Install once on the development machine:

    Node.js 20.11 or later
    pnpm 9 or later
    Docker Engine and Docker Compose
    Python 3.11 for AI services only
    psql client
    mongosh client
    redis-cli client

Verify versions:

    node --version
    pnpm --version
    docker --version
    docker compose version
    python3.11 --version
    psql --version
    mongosh --version
    redis-cli --version

## 1. Environment Files

Copy templates and fill values.

    cp .env.example .env
    cp deploy/local-dev/.env.local.example deploy/local-dev/.env.local

Required values in both files:

    POSTGRES_PASSWORD    Use: openssl rand -hex 32
    MONGO_PASSWORD       Use: openssl rand -hex 32

Required values in .env only:

    JWT_SECRET              Use: openssl rand -hex 32
    DEVICE_FINGERPRINT_SALT Use: openssl rand -hex 32

Do not commit .env or .env.local.

## 2. Install Dependencies

    pnpm install

This installs workspace dependencies only. No build occurs.

## 3. Start Local Infrastructure

    pnpm infra:up

Expected containers:

    techgeo-postgres       healthy
    techgeo-mongo          healthy
    techgeo-redis-ledger   healthy
    techgeo-redis-cache    healthy
    techgeo-kafka          running

Verify:

    docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'

## 4. Apply Migrations

    pnpm db:migrate

This runs every SQL file in database/postgres in order: migrations,
functions, views, triggers.

Verify tables:

    psql "$POSTGRES_URL" -c "\dt"

Expected tables:

    currency_rates
    organizations
    employees
    attendance_logs
    fiat_deposits
    ledger_accounts
    ledger_transfers
    escrow_transactions
    identity_traceback
    device_bindings
    businesses
    storefronts
    voice_profiles
    family_circles
    audit_logs
    ai_restrictions
    rbac_roles
    rbac_permissions

## 5. Seed Development Data

    NODE_ENV=development pnpm db:seed

This seeds currency rates, treasury and escrow accounts, and RBAC
permissions. Seeding is disabled when NODE_ENV=production.

## 6. Start Services

    pnpm dev

This runs all workspace packages in dev mode via Turbo. Individual
services can be started with:

    pnpm --filter @techgeo/currency dev

## 7. Verify Local Stack

    curl http://localhost:3000/health
    curl http://localhost:3001/health
    curl http://localhost:3002/health

Each service exposes GET /health.

## 8. Stop Local Infrastructure

    pnpm infra:down

## 9. Reset Local Data

    bash deploy/local-dev/reset.sh

Destroys all local volumes after confirmation.

## Production Deployment

Do not use this checklist for production. Use docs/guides/deployment.md.

Order of operations for production:

    1. Provision Neon Postgres. Set POSTGRES_URL.
    2. Provision MongoDB Atlas. Set MONGO_URL.
    3. Provision Upstash Redis (noeviction). Set REDIS_LEDGER_URL.
    4. Provision Zeabur Redis (allkeys-lru). Set REDIS_CACHE_URL.
    5. Deploy backend services to Render.
    6. Deploy always-on services to Zeabur.
    7. Deploy AI Spaces to Hugging Face.
    8. Deploy web frontends to Vercel.
    9. Deploy edge worker to Cloudflare.
    10. Build mobile clients with Expo EAS.

Every production step requires a corresponding environment token.
Never commit these tokens.

## Verification After Install

    Total directories:  find . -type d -not -path "./node_modules/*" -not -path "./.git/*" | wc -l
    Total files:        find . -type f -not -path "./node_modules/*" -not -path "./.git/*" | wc -l

    Postgres:           psql "$POSTGRES_URL" -c "\dt"
    Mongo:              mongosh "$MONGO_URL" --eval "db.getCollectionNames()"
    Redis ledger:       redis-cli -u "$REDIS_LEDGER_URL" CONFIG GET maxmemory-policy
    Redis cache:        redis-cli -u "$REDIS_CACHE_URL" CONFIG GET maxmemory-policy

Expected Redis policies:

    Ledger instance:    noeviction
    Cache instance:     allkeys-lru

If the ledger instance does not report noeviction, stop. Do not proceed.
