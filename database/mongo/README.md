# MongoDB

## Layout

    collections/   Collection and index definitions
    indexes/       Standalone index migration scripts

## Collections

    activity_logs        User activity events
    gold_logs            High-quality events for model training
    voice_profiles       Voice fingerprint references (not raw audio)
    map_paths            Route history
    traffic_stops        Observed stop durations
    weather_snapshots    Weather along route corridors
    ai_events            AI decision and action log
    user_intents         Captured user intent for context

## Conventions

All documents include account_id where applicable and created_at.

Geo indexes use 2dsphere. Time indexes use descending order.

No PII is stored in Mongo. Identity data lives in Postgres behind KMS.

## Running

    export MONGO_URL=...
    NODE_ENV=development bash scripts/db-seed.sh
