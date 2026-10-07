#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DB_URL="${POSTGRES_URL:-}"
MONGO_URI="${MONGO_URL:-}"

if [[ "${NODE_ENV:-development}" == "production" ]]; then
  echo "ERROR: Seeding is disabled in production."
  exit 1
fi

if [[ -n "$DB_URL" ]]; then
  shopt -s nullglob
  for f in "$ROOT/database/postgres/seeds"/*.sql; do
    echo "Seeding Postgres: $f"
    psql "$DB_URL" -v ON_ERROR_STOP=1 -f "$f"
  done
  shopt -u nullglob
fi

if [[ -n "$MONGO_URI" ]]; then
  shopt -s nullglob
  for f in "$ROOT/database/mongo/collections"/*.js; do
    echo "Seeding Mongo: $f"
    mongosh "$MONGO_URI" --quiet --file "$f"
  done
  shopt -u nullglob
fi

echo "Seed complete."
