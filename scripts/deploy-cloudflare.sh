#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${CF_API_TOKEN:-}" ]]; then
  echo "ERROR: CF_API_TOKEN is not set."
  exit 1
fi

if ! command -v wrangler >/dev/null 2>&1; then
  echo "ERROR: wrangler CLI is not installed."
  exit 1
fi

( cd deploy/cloudflare-edge && wrangler deploy )
