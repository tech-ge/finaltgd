#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${REDIS_LEDGER_URL:-}" ]]; then
  echo "REDIS_LEDGER_URL is required"
  exit 1
fi

STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
DEST="${BACKUP_DIR:-./backups}"
mkdir -p "$DEST"

redis-cli -u "$REDIS_LEDGER_URL" --rdb "$DEST/redis-ledger-$STAMP.rdb"
echo "backup written: $DEST/redis-ledger-$STAMP.rdb"
