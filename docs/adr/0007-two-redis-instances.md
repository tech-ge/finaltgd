# ADR 0007: Two Redis Instances

## Status

Accepted.

## Context

TechGeo needs distributed locks for ledger correctness and ephemeral
cache for sessions and pub/sub. These have conflicting requirements:
locks must never be evicted, cache should evict freely under pressure.

## Decision

Operate two physically separate Redis instances with different eviction
policies. Route connections by purpose through distinct environment
variables.

## Consequences

Operational overhead of managing two instances. In return, ledger
correctness is preserved even under memory pressure on the cache side.

## Enforcement

REDIS_LEDGER_URL and REDIS_CACHE_URL are separate variables. Tests
assert that the ledger client is connected to a noeviction instance at
startup.
