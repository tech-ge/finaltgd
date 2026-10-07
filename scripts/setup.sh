#!/usr/bin/env bash
set -euo pipefail

if [[ ! -f .env ]]; then
  echo "ERROR: .env not found. Copy .env.example to .env and fill values."
  exit 1
fi

pnpm install
bash scripts/dev-up.sh
bash scripts/db-migrate.sh
bash scripts/db-seed.sh

echo "Setup complete. Run: pnpm dev"
