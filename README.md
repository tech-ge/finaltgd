# TechGeo

Global Unified Agentic Ecosystem.

A unified smartphone-based operating network combining digital currency,
two-point routing, on-device AI health diagnostics, corporate attendance,
and enterprise RBAC.

## Status

Scaffold complete. Every directory declared in the architecture blueprint
exists. Every file has placeholder content that fails loudly when imported
without an implementation. No production secrets are committed. No
withdrawal operation exists anywhere in the tree.

## Repository Layout

    apps/            Client applications
    services/        Backend microservices
    packages/        Shared internal libraries
    ai/              Model source and training pipelines
    database/        Schema, migrations, seeds
    deploy/          Host-specific deployment configuration
    infrastructure/  Kubernetes, Terraform, monitoring
    docs/            Architecture, API, ADR, guides
    scripts/         Automation scripts
    tests/           End-to-end, load, security tests

## Hosting Topology

    apps/user-app              Expo EAS      Android APK, iOS IPA
    apps/assistant-app         Expo EAS      Android APK, iOS IPA
    apps/business-portal       Vercel        Web dashboard
    apps/admin-console         Vercel        Web dashboard
    apps/laptop-mirror         Vercel        Web viewer, no transaction authority

    services/gateway           Render        REST and WebSocket entry
    services/currency          Render        TGD ledger and minting
    services/identity          Render        National ID and device binding
    services/maps              Render        Routing and traffic ingestion
    services/attendance        Render        IP and GPS presence verification
    services/health            Render        Vitals and activity analytics
    services/business          Render        Storefront and settlement
    services/admin             Render        RBAC and live monitoring

    services/ai-orchestrator   Zeabur        Always-on AI routing
    services/assistant         Zeabur        Always-on voice and calls
    services/gateway/websocket Zeabur        Always-on real-time streams

    ai/shadow-student          Hugging Face  Model hosting
    ai/voice                   Hugging Face  Voice clone and TTS
    ai/speech                  Hugging Face  On-device model export

    database/postgres          Neon          Managed Postgres
    database/mongo             MongoDB Atlas Managed Mongo
    database/redis (ledger)    Upstash       Ledger locks, no eviction
    database/redis (cache)     Zeabur        Session cache, LRU

    deploy/cloudflare-edge     Cloudflare    Edge rate limiting and routing

## Core Invariants

These rules are enforced in code and must not be violated.

1. No withdrawal operation exists anywhere in the system.
   Value enters via deposit only. Value moves via send or transact only.
   See services/currency/src/ledger/policy.ts

2. AI agents issue requests only. They never issue commands.
   See services/ai-orchestrator/src/agent-to-agent/RefusalEngine.ts

3. One phone maps to one account.
   See services/identity/src/device-lock/OnePhoneOneAccount.ts

4. Voice profiles are isolated per account.
   See services/assistant/src/voice-clone/VoiceVault.ts

5. Rule violations trigger a 2-day AI restriction.
   See services/ai-orchestrator/src/rules-engine/AiRestrictionScheduler.ts

6. Ledger Redis uses noeviction. Cache Redis uses allkeys-lru.
   See deploy/render-databases/redis-cloud/eviction-policy.md

7. Laptop mirror sessions can read and post only.
   See apps/laptop-mirror/src/components/ReadOnlyGuard.tsx

## Getting Started

Review the install checklist before running anything.

    cat INSTALL.md
    cat PRODUCTION-CHECKLIST.md

Then, when dependencies are installed:

    cp .env.example .env
    pnpm install
    pnpm infra:up
    pnpm db:migrate
    pnpm db:seed
    pnpm dev

## Documentation

    docs/architecture    System design
    docs/adr             Architectural decisions
    docs/security        Threat model and incident response
    docs/guides          Operational procedures
    docs/api             OpenAPI specifications

## Verification

The following commands confirm structural integrity.

    find . -type d -not -path "./node_modules/*" -not -path "./.git/*" | wc -l
    find . -type f -not -path "./node_modules/*" -not -path "./.git/*" | wc -l
    bash scripts/verify-invariants.sh

## License

Proprietary. See LICENSE.
