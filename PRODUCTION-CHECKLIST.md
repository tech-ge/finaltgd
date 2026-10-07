# Production Checklist

Run every item before opening the system to real users.

## Security

    [ ] All secrets in .env are 32-byte hex generated with openssl rand
    [ ] No secret appears in any committed file
    [ ] .env and .env.local are gitignored
    [ ] JWT_SECRET rotated from any development value
    [ ] DEVICE_FINGERPRINT_SALT rotated from any development value
    [ ] HTTPS enforced on all public endpoints
    [ ] TLS 1.2 or higher on all managed databases
    [ ] KMS keys provisioned for identity and voice encryption
    [ ] audit_logs write confirmed on privileged operations
    [ ] Redis ledger instance reports noeviction
    [ ] Redis cache instance reports allkeys-lru

## Data

    [ ] Postgres migrations applied and idempotent
    [ ] Postgres functions created and callable
    [ ] Postgres views resolve without error
    [ ] Postgres triggers installed and firing
    [ ] Mongo collections created with indexes
    [ ] Redis key namespaces documented and enforced
    [ ] Backups scheduled and restore tested

## Services

    [ ] All eight Render services respond to GET /health
    [ ] All three Zeabur services respond to GET /health
    [ ] All three Hugging Face Spaces respond to GET /health
    [ ] Cloudflare Worker rate limit verified
    [ ] Web frontends load and authenticate
    [ ] Mobile apps build and connect to production gateway

## Invariants

    [ ] No withdrawal route exists in any service
    [ ] No withdrawal table exists in any migration
    [ ] No withdrawal method exists in any SDK
    [ ] AI agents reject non-request messages
    [ ] Device binding rejects second device without dispute
    [ ] Voice vault rejects cross-account access
    [ ] Rule violation triggers 2-day AI restriction
    [ ] Laptop mirror rejects transaction attempts

## Observability

    [ ] Logs shipped from every service
    [ ] Error tracking configured
    [ ] Metrics dashboards live
    [ ] Alerts wired to on-call
    [ ] Runbook documented for S1, S2, S3

## Compliance

    [ ] Data processing policy documented
    [ ] User consent captured for voice and location
    [ ] Identity data access requires dispute record
    [ ] Audit trail retention policy defined
    [ ] Incident response procedure rehearsed
