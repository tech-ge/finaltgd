#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MONGO_URI="${MONGO_URL:-}"

if [[ -z "$MONGO_URI" ]]; then
  echo "ERROR: MONGO_URL is not set."
  exit 1
fi

python3 "$ROOT/ai/pipelines/gold_log_export.py" \
  --source "$MONGO_URI" \
  --out "$ROOT/ai/shadow-student/gold-logs/extracted"
