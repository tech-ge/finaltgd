# Zeabur Services

Deploys always-on services: ai-orchestrator, assistant, websocket.

## Deploy

    export ZEABUR_TOKEN=...
    bash scripts/deploy-zeabur.sh

## Redis Add-On

The Redis add-on uses allkeys-lru. Never use it for ledger locks.

## Why Zeabur

WebSocket streams and AI inference require a persistent process. Zeabur
does not sleep idle services.
