# Postgres

## Layout

    migrations/    Table definitions, in numeric order
    functions/     Business logic in SQL
    views/         Read-only projections
    triggers/      Automatic field maintenance and invariants
    seeds/         Development-only initial data

## Apply Order

    1. migrations
    2. functions
    3. views
    4. triggers
    5. seeds (development only)

## Conventions

All amounts use DECIMAL(18, 4). Never floating point.

Every transfer writes two rows via fn_atomic_transfer. Balances are
derived from ledger entries via fn_balance_check. No mutable balance
column exists.

audit_logs is append-only. A trigger prevents update and delete.

Withdrawal is not a valid operation. fn_atomic_transfer will reject it.

## Running

    export POSTGRES_URL=...
    bash scripts/db-migrate.sh
    NODE_ENV=development bash scripts/db-seed.sh
