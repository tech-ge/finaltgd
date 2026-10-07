# Hosting Postgres on Neon

## Provision

Create a project in eu-central-1. Copy the connection string.

## Apply Migrations

    export POSTGRES_URL=...
    bash scripts/db-migrate.sh

## Branching

Use Neon branches for staging and preview environments. Each branch has
its own connection string.

## Autosuspend

Configure autosuspend to 5 minutes in development. Disable autosuspend
in production.
