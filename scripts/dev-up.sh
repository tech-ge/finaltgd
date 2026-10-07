#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../deploy/local-dev"

if [[ ! -f .env.local ]]; then
  echo "ERROR: deploy/local-dev/.env.local not found."
  echo "Copy .env.local.example to .env.local and fill values."
  exit 1
fi

docker compose --env-file .env.local up -d
sleep 6
docker compose ps
