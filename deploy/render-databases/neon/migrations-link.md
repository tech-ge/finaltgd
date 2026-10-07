# Neon Migrations

Migrations live in `database/postgres/migrations`. Apply them with:

    export POSTGRES_URL=...
    bash scripts/db-migrate.sh

The script runs every SQL file in numeric order. It is safe to rerun
because each migration uses `CREATE TABLE IF NOT EXISTS` or
`CREATE OR REPLACE`.

Never run the seeds in production. `scripts/db-seed.sh` refuses to run
when `NODE_ENV=production`.
