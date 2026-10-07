#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${RENDER_API_KEY:-}" ]]; then
  echo "ERROR: RENDER_API_KEY is not set."
  exit 1
fi

if ! command -v render >/dev/null 2>&1; then
  echo "ERROR: render CLI is not installed."
  exit 1
fi

render deploys create \
  --config deploy/render-backend/render.yaml \
  --confirm \
  --wait
