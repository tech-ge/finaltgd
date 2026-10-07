# Cloudflare Edge

A Worker rate-limits API traffic before it reaches the gateway.

## Deploy

    export CF_API_TOKEN=...
    bash scripts/deploy-cloudflare.sh

## Configuration

Set API_GATEWAY_URL and KV namespace binding in wrangler.toml before
deploying.
