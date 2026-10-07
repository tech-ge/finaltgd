#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DB_URL="${POSTGRES_URL:-}"

if [[ -z "$DB_URL" ]]; then
  echo "ERROR: POSTGRES_URL is not set."
  exit 1
fi

run_dir() {
  local dir="$1"
  if [[ ! -d "$dir" ]]; then
    return
  fi
  shopt -s nullglob
  for f in "$dir"/*.sql; do
    echo "Applying $f"
    psql "$DB_URL" -v ON_ERROR_STOP=1 -f "$f"
  done
  shopt -u nullglob
}

run_dir "$ROOT/database/postgres/migrations"
run_dir "$ROOT/database/postgres/functions"
run_dir "$ROOT/database/postgres/views"
run_dir "$ROOT/database/postgres/triggers"

echo "Migrations complete."
