#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
cd "$ROOT"

bash scripts/deploy-render.sh
bash scripts/deploy-zeabur.sh
bash scripts/deploy-vercel.sh
