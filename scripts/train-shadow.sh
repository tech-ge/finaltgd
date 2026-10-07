#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

python3 "$ROOT/ai/pipelines/idle_train.py" \
  --gold-logs "$ROOT/ai/shadow-student/gold-logs/extracted" \
  --output "$ROOT/ai/shadow-student/lora-checkpoints/latest" \
  --config "$ROOT/ai/shadow-student/training/config.yaml"
