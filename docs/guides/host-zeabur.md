# Hosting on Zeabur

## Provision

Create a project. Set ZEABUR_TOKEN.

## Deploy

    bash scripts/deploy-zeabur.sh

## Redis Add-On

Provision the Redis add-on from the Zeabur console. Confirm the eviction
policy is allkeys-lru.

## Why Zeabur

Zeabur does not sleep idle services. WebSocket and AI streaming require
a persistent process. Zeabur fits this workload class.
