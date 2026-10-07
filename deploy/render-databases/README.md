# Render Databases

Managed database provisioning for Postgres, Mongo, and Redis.

    neon/                 Postgres on Neon
    mongo-atlas/          MongoDB Atlas cluster reference
    redis-cloud/          Upstash Redis for ledger locks
    backups/              Backup scripts

## Connection Strings

Every connection string is injected via environment. None is committed.

## Eviction Policy

The Upstash Redis instance uses noeviction. See
redis-cloud/eviction-policy.md. Do not change.
