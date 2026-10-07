# Local Development

Docker Compose brings up Postgres, Mongo, Redis (two instances), and
Kafka.

## First Time

    cp .env.local.example .env.local
    # Fill POSTGRES_PASSWORD and MONGO_PASSWORD

## Start

    bash start.sh

## Stop

    bash stop.sh

## Reset

    bash reset.sh

## Ports

    5432   Postgres
    27017  Mongo
    6379   Redis ledger (noeviction)
    6380   Redis cache (allkeys-lru)
    9092   Kafka

All bound to 127.0.0.1 only.
