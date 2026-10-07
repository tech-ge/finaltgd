#!/usr/bin/env bash
set -euo pipefail

FILE="${1:-}"
if [[ -z "$FILE" || ! -f "$FILE" ]]; then
  echo "Usage: restore.sh <backup-file>"
  exit 1
fi

case "$FILE" in
  *.sql.gz)
    [[ -n "${POSTGRES_URL:-}" ]] || { echo "POSTGRES_URL not set"; exit 1; }
    gunzip -c "$FILE" | psql "$POSTGRES_URL" -v ON_ERROR_STOP=1
    ;;
  *.archive)
    [[ -n "${MONGO_URL:-}" ]] || { echo "MONGO_URL not set"; exit 1; }
    mongorestore --uri="$MONGO_URL" --archive="$FILE" --gzip
    ;;
  *.rdb)
    [[ -n "${REDIS_LEDGER_URL:-}" ]] || { echo "REDIS_LEDGER_URL not set"; exit 1; }
    redis-cli -u "$REDIS_LEDGER_URL" --pipe < "$FILE"
    ;;
  *)
    echo "Unknown backup type: $FILE"
    exit 1
    ;;
esac

echo "Restore complete."
