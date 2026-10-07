# Redis Key Conventions

## Ledger Instance (noeviction)

    lock:transfer:<idempotency_key>     Distributed lock, TTL 30s
    lock:escrow:<escrow_id>             Distributed lock, TTL 30s
    rate:financial:<account_id>         Rate limit counter

## Cache Instance (allkeys-lru)

    session:<token_hash>                Session record, TTL 7d
    ws:channel:<topic>                  Pub/sub channel
    ai:cache:<account_id>:<intent>      AI response cache, TTL 5m
    geo:latest:<account_id>             Latest coarse location, TTL 60s
