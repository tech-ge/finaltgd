# Redis Eviction Policy - Ledger Instance

Host: Upstash
Policy: noeviction
Persistence: AOF with everysec fsync

The ledger Redis holds distributed locks acquired before every atomic
transfer. If a lock is evicted mid-transaction, two concurrent requests
can both pass the balance check, producing a double-spend.

When memory is exhausted, writes fail with an out-of-memory error. The
transfer is rejected and the client retries. This is the safe failure mode.

Do not change this policy.
