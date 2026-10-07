# Vercel Frontends

Three Next.js apps deploy to Vercel: business-portal, admin-console,
laptop-mirror.

## Deploy

    export VERCEL_TOKEN=...
    bash scripts/deploy-vercel.sh

## Environment

Each app has its own environment variables. Set them in the Vercel
dashboard, not in the repository.
