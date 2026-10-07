# Hosting Redis on Upstash

## Provision

Create a database in eu-west-1. Set eviction to noeviction. Enable TLS.

## Connect

    export REDIS_LEDGER_URL=rediss://...

## Backup

Upstash manages backups. Verify restore procedure before launch.

## Eviction

Never change from noeviction on this instance. See
deploy/render-databases/redis-cloud/eviction-policy.md.
