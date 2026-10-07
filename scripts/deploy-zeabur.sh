#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${ZEABUR_TOKEN:-}" ]]; then
  echo "ERROR: ZEABUR_TOKEN is not set."
  exit 1
fi

if ! command -v zeabur >/dev/null 2>&1; then
  echo "ERROR: zeabur CLI is not installed."
  exit 1
fi

zeabur deploy --config deploy/zeabur-services/zeabur.json
