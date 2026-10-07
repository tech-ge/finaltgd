# ADR 0001: Monorepo

## Status

Accepted.

## Context

TechGeo spans mobile apps, web apps, backend services, shared SDKs, AI
models, and database schemas. These components evolve together and share
type definitions.

## Decision

Use a single monorepo managed by pnpm workspaces and Turbo.

## Consequences

Shared types and SDKs are versioned atomically with their consumers.
CI runs affected tests only via Turbo's dependency graph.

Tradeoff: repository grows over time. Mitigation: strict folder
boundaries and per-service Dockerfiles keep deploy artifacts small.
