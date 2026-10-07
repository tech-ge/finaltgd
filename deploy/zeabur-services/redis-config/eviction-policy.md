# Redis Eviction Policy - Cache Instance

Host: Zeabur add-on
Policy: allkeys-lru
Persistence: RDB every 60 seconds if at least 1 key changed

The cache Redis holds sessions, pub/sub channels for real-time streams,
and AI voice session caches. All entries are recomputable from primary
sources. Eviction under memory pressure is safe.

Do not store ledger locks or balances in this instance.
