# Deployment Guide

## Order of Operations

1. Provision databases.
2. Deploy backend services.
3. Deploy always-on services.
4. Deploy AI Spaces.
5. Deploy web frontends.
6. Deploy edge worker.
7. Build mobile clients.

## Databases

Neon: create a project. Copy the connection string. Set POSTGRES_URL.

MongoDB Atlas: create a cluster. Copy the connection string. Set MONGO_URL.

Upstash: create a Redis database in eu-west-1. Set eviction to noeviction.
Set REDIS_LEDGER_URL.

Zeabur Redis: provision the add-on. Set REDIS_CACHE_URL and REDIS_URL.

## Backend Services

    export RENDER_API_KEY=...
    bash scripts/deploy-render.sh

## Always-On Services

    export ZEABUR_TOKEN=...
    bash scripts/deploy-zeabur.sh

## AI Spaces

    export HF_TOKEN=...
    bash scripts/deploy-huggingface.sh

## Web Frontends

    export VERCEL_TOKEN=...
    bash scripts/deploy-vercel.sh

## Edge Worker

    export CF_API_TOKEN=...
    bash scripts/deploy-cloudflare.sh

## Mobile Clients

    export EXPO_TOKEN=...
    bash scripts/build-apk.sh user-app
    bash scripts/build-ios.sh user-app

## Verification

    curl https://techgeo-gateway.onrender.com/health
    curl https://techgeo-gateway.onrender.com/version
