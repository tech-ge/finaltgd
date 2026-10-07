#!/usr/bin/env bash
set -euo pipefail

APP="${1:-user-app}"
APP_DIR="apps/$APP"

if [[ ! -d "$APP_DIR" ]]; then
  echo "ERROR: App directory not found: $APP_DIR"
  exit 1
fi

if ! command -v eas >/dev/null 2>&1; then
  echo "ERROR: eas CLI is not installed."
  exit 1
fi

( cd "$APP_DIR" && eas build -p ios --profile preview --non-interactive )
