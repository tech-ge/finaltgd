# TechGeo Architecture Overview

TechGeo is a multi-service ecosystem composed of five functional domains
sharing a common identity, ledger, and policy layer.

## Domains

1. Financial. The TGD ledger, minting pipeline, escrow, and settlement.
2. Mobility. Two-point routing, traffic ingestion, weather oracle.
3. Health. Sensor fusion, audio analytics, move-to-earn rewards.
4. Assistant. Voice clone, call handling, emergency escalation.
5. Enterprise. RBAC hierarchy, attendance verification, business SaaS.

## Data Layer

Postgres holds all transactional state: accounts, ledger entries, deposits,
escrow, organizations, employees, attendance logs, audit records.

Mongo holds high-volume append-only logs: activity, gold logs, voice
profiles, map paths, traffic snapshots, AI events.

Redis holds two classes of ephemeral state:

- Ledger locks on the noeviction instance. These guard atomic transfers.
- Sessions and pub/sub channels on the allkeys-lru instance.

Kafka carries domain events between services. Topics are versioned.

## Service Boundaries

Each service owns its schema and exposes a versioned API. Cross-service
reads occur through the gateway or through published events, never through
direct database access.

## Security Model

Every request passes through the gateway, which verifies JWT, device
fingerprint, and RBAC role. Services trust the gateway signature but
re-verify role on sensitive operations.

Sensitive fields, including national ID and voice embeddings, are encrypted
at rest with keys held in a managed KMS. Access requires a formal dispute
record and is written to the immutable audit trail.

## Hosting Topology

See README.md for the host assignment table. Each host is chosen for its
fit to the workload class:

- Render for request-driven services on free or starter plan.
- Zeabur for always-on WebSocket and AI services.
- Hugging Face Spaces for model inference.
- Neon and Atlas for managed databases.
- Upstash for ledger Redis.
- Vercel for web frontends.
- Cloudflare for edge rate limiting.
