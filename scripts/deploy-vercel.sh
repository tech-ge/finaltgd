#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${VERCEL_TOKEN:-}" ]]; then
  echo "ERROR: VERCEL_TOKEN is not set."
  exit 1
fi

if ! command -v vercel >/dev/null 2>&1; then
  echo "ERROR: vercel CLI is not installed."
  exit 1
fi

for app in business-portal admin-console laptop-mirror; do
  echo "Deploying $app"
  ( cd "apps/$app" && vercel --prod --yes --token "$VERCEL_TOKEN" )
done
