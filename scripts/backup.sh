#!/usr/bin/env bash
set -euo pipefail

STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
DEST="${BACKUP_DIR:-./backups}"
mkdir -p "$DEST"

if [[ -n "${POSTGRES_URL:-}" ]]; then
  echo "Backing up Postgres"
  pg_dump "$POSTGRES_URL" | gzip > "$DEST/postgres-$STAMP.sql.gz"
fi

if [[ -n "${MONGO_URL:-}" ]]; then
  echo "Backing up Mongo"
  mongodump --uri="$MONGO_URL" --archive="$DEST/mongo-$STAMP.archive" --gzip
fi

if [[ -n "${REDIS_LEDGER_URL:-}" ]]; then
  echo "Backing up Redis ledger"
  redis-cli -u "$REDIS_LEDGER_URL" --rdb "$DEST/redis-ledger-$STAMP.rdb"
fi

echo "Backups written to $DEST"
