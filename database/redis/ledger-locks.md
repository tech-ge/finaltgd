# Ledger Locks

Locks are acquired with SET NX PX and released with a Lua script that
verifies the token before deletion.

Token format: 32-byte hex generated per acquisition.

TTL: 30 seconds. If a process dies holding a lock, the lock expires
automatically. Retry logic handles transient lock conflicts.

Never store locks in the cache instance.
