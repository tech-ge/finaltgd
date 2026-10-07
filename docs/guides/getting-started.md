# Getting Started

## Prerequisites

- Node.js 20.11 or later
- pnpm 9 or later
- Docker and Docker Compose
- Python 3.11 for AI services only
- psql and mongosh clients

## First-Time Setup

1. Copy the environment template.

        cp .env.example .env

2. Fill in required values in .env. At minimum set:

        POSTGRES_PASSWORD
        MONGO_PASSWORD
        JWT_SECRET
        DEVICE_FINGERPRINT_SALT

   Generate secrets with:

        openssl rand -hex 32

3. Copy the local development environment.

        cp deploy/local-dev/.env.local.example deploy/local-dev/.env.local

   Fill POSTGRES_PASSWORD and MONGO_PASSWORD to match .env.

4. Install dependencies.

        pnpm install

5. Start local infrastructure.

        pnpm infra:up

6. Run migrations.

        pnpm db:migrate

7. Seed initial data for development.

        pnpm db:seed

8. Start all services.

        pnpm dev

## Verifying

    psql "$POSTGRES_URL" -c "\dt"
    mongosh "$MONGO_URL" --eval "db.getCollectionNames()"
    redis-cli -u "$REDIS_LEDGER_URL" CONFIG GET maxmemory-policy
    redis-cli -u "$REDIS_CACHE_URL" CONFIG GET maxmemory-policy

## Stopping

    pnpm infra:down

## Resetting Local Data

    bash deploy/local-dev/reset.sh
