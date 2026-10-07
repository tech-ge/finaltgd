# WebSocket Session Stickiness

The gateway WebSocket server maintains per-connection state in Redis
pub/sub. Any replica can serve any connection because subscribers attach
to the same Redis channels.

If Redis pub/sub is unavailable, fall back to ip_hash at the load
balancer so each client's connection is pinned to a single replica.

Do not enable sticky sessions as the primary strategy. Prefer Redis
pub/sub so replicas remain interchangeable.
