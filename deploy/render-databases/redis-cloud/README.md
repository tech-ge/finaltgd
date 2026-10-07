# Upstash Redis

Two logical instances are needed at deployment time.

Ledger instance, eviction policy noeviction. Holds distributed locks
for atomic transfers. Never evict.

Cache instance, eviction policy allkeys-lru. Holds sessions, pub/sub
channels, and AI caches. Safe to evict.

## Provision

1. Create a database in eu-west-1.
2. Enable TLS.
3. Set eviction to noeviction for the ledger instance.
4. Copy the rediss URL into REDIS_LEDGER_URL.
5. Create a second database for the cache with allkeys-lru.
6. Copy the rediss URL into REDIS_CACHE_URL.

## Verify

    redis-cli -u "$REDIS_LEDGER_URL" CONFIG GET maxmemory-policy
    # Expected: noeviction

    redis-cli -u "$REDIS_CACHE_URL" CONFIG GET maxmemory-policy
    # Expected: allkeys-lru

If the ledger instance does not report noeviction, stop.
