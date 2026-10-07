#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

if [[ ! -f .env.local ]]; then
  echo "ERROR: .env.local not found. Copy .env.local.example to .env.local and fill values."
  exit 1
fi

set -a
source .env.local
set +a

docker compose --env-file .env.local up -d
sleep 8
docker compose ps
