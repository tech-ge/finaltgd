# ADR 0002: Postgres and Mongo

## Status

Accepted.

## Context

TechGeo has two data shapes:

    Transactional state (accounts, ledger, organizations, attendance)
    Append-only telemetry (activity, gold logs, map paths, AI events)

## Decision

Postgres for transactional state. Mongo for append-only telemetry.

## Consequences

Postgres provides ACID, strong types, and mature tooling for money.
Mongo provides flexible schema and high write throughput for logs.

Tradeoff: two systems to operate. Mitigation: each service touches only
one of them. Cross-store joins are forbidden.
