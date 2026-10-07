# Database

## Postgres

Transactional state. Migrations run in numeric order. Functions and
views are created after all tables exist. Triggers install last.

Migration order:

    001_currency_rates
    002_organizations
    003_employees
    004_attendance_logs
    005_fiat_deposits
    006_ledger_accounts
    007_ledger_transfers
    008_escrow_transactions
    009_identity_traceback
    010_device_bindings
    011_businesses
    012_storefronts
    013_voice_profiles
    014_family_circles
    015_audit_logs
    016_ai_restrictions
    017_rbac_roles

## Mongo

Append-only telemetry. Collections are created with their indexes in the
same script.

## Redis

Two instances. See docs/architecture/10-redis-topology.md.

## Seeds

Seeds run only when NODE_ENV is not production.
