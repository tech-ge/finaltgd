#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${HF_TOKEN:-}" ]]; then
  echo "ERROR: HF_TOKEN is not set."
  exit 1
fi

for space in shadow-student-space voice-clone-space speech-analytics-space; do
  dir="deploy/huggingface-ai/$space"
  if [[ ! -d "$dir" ]]; then
    echo "Skipping missing space: $space"
    continue
  fi
  echo "Deploying space: $space"
  ( cd "$dir" && huggingface-cli upload . --repo-type space --token "$HF_TOKEN" )
done
