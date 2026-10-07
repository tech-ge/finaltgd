# Local Development

## Running a Single Service

    pnpm --filter @techgeo/currency dev

## Running Tests for One Service

    pnpm --filter @techgeo/currency test

## Rebuilding Types

    pnpm --filter @techgeo/common build

## Watching Logs

    docker compose -f deploy/local-dev/docker-compose.yml logs -f postgres
    docker compose -f deploy/local-dev/docker-compose.yml logs -f redis-ledger

## Inspecting Redis

    redis-cli -u "$REDIS_LEDGER_URL" MONITOR
    redis-cli -u "$REDIS_CACHE_URL" PUBSUB CHANNELS

## Inspecting Kafka Topics

    docker exec -it techgeo-kafka kafka-topics.sh --bootstrap-server localhost:9092 --list

## Common Issues

Port already in use: change the host port in deploy/local-dev/docker-compose.yml.

Postgres rejects connection: verify POSTGRES_PASSWORD matches in both .env
files and restart the container.

Redis lock never released: check the ledger Redis log for errors. Restart
the currency service. Locks have a TTL and will expire automatically.
