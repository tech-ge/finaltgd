# Hosting on Vercel

## Provision

Create a project. Set VERCEL_TOKEN.

## Deploy

    bash scripts/deploy-vercel.sh

The script deploys business-portal, admin-console, and laptop-mirror.

## Environment

Set environment variables in the Vercel dashboard per project. Do not
commit .env files.

## Domains

Assign production domains after first deploy. Point DNS per Vercel's
instructions.
