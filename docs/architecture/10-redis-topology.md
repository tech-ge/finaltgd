# Redis Topology

TechGeo runs two physically separate Redis instances. They are never
interchanged.

## Ledger Instance

Host: Upstash
Policy: noeviction
Persistence: AOF everysec

Used by:

    services/currency/src/ledger/RedisLock.ts
    services/gateway/src/rate-limit/RedisLimiter.ts

Purpose: acquire and release distributed locks around ledger operations.

Failure mode: writes fail with an error. Transfer rejected. Client retries.

## Cache Instance

Host: Zeabur add-on
Policy: allkeys-lru
Persistence: RDB every 60 seconds if at least one key changed

Used by:

    services/gateway/src/auth/SessionStore.ts
    services/gateway/src/websocket/RedisPubSub.ts
    services/assistant/src/voice-clone/HfVoiceClient.ts

Purpose: hold disposable state that can be recomputed.

Failure mode: oldest keys evicted. Sessions re-authenticate. Subscribers
refresh from source.

## Forbidden Operations

    Do not store balances in either Redis instance.
    Do not store ledger locks in the cache instance.
    Do not swap the connection strings.
    Do not enable eviction on the ledger instance.
