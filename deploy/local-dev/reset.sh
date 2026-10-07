#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

read -r -p "This deletes ALL local data. Continue? (yes/N): " confirm
if [[ "$confirm" != "yes" ]]; then
  echo "Aborted."
  exit 0
fi

docker compose down -v
echo "Local volumes removed."
