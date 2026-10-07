# TechGeo Structural Summary

Snapshot of the repository as scaffolded.

## Counts

Directories         379
Files               954
Empty files         87 (only .gitkeep placeholders in empty directories)
Empty directories   0

## Top-Level Trees

    ai                   Model source and training pipelines
    apps                 Client applications
    database             Schema, migrations, seeds
    deploy               Host-specific deployment configuration
    docs                 Architecture, API, ADR, guides
    infrastructure       Kubernetes, Terraform, monitoring
    packages             Shared internal libraries
    scripts              Automation scripts
    services             Backend microservices
    tests                End-to-end, load, security tests

## Empty File Policy

All .gitkeep files are intentionally empty. They hold directory
structure in version control where the directory contains no source
files yet. Every other file in the tree contains at least a comment
header or a safe stub.

## Invariant Coverage

The following files enforce the seven core invariants:

    services/currency/src/ledger/policy.ts
    services/ai-orchestrator/src/agent-to-agent/RefusalEngine.ts
    services/identity/src/device-lock/OnePhoneOneAccount.ts
    services/assistant/src/voice-clone/VoiceVault.ts
    services/ai-orchestrator/src/rules-engine/AiRestrictionScheduler.ts
    deploy/render-databases/redis-cloud/eviction-policy.md
    apps/laptop-mirror/src/components/ReadOnlyGuard.tsx

## Next Steps

    1. Review INSTALL.md and PRODUCTION-CHECKLIST.md.
    2. Install dependencies when ready.
    3. Fill environment files with generated secrets.
    4. Run migrations and seeds locally.
    5. Begin service implementation, starting with the currency ledger.

## Final Note

No installation was performed. No secrets were committed. The tree is
safe to inspect, edit, and commit as-is.
