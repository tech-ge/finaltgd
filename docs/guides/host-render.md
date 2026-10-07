# Hosting on Render

## Provision

Create an account. Set RENDER_API_KEY in the environment.

## Deploy

    bash scripts/deploy-render.sh

The script submits deploy/render-backend/render.yaml.

## Environment

The envVarGroup techgeo-common holds shared values. Individual services
add SERVICE_NAME and PORT.

Secrets marked sync: false must be set in the Render dashboard.

## Free Tier Caveat

Free tier services sleep after 15 minutes of inactivity. The first
request after sleep takes about a minute. For production, use the
starter plan.
