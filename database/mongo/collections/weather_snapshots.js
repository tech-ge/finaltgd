db = db.getSiblingDB('techgeo');
db.createCollection('weather_snapshots');
db.weather_snapshots.createIndex({ "corridor.geo": "2dsphere" });
db.weather_snapshots.createIndex({ observed_at: -1 });
