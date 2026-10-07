db = db.getSiblingDB('techgeo');
db.createCollection('map_paths');
db.map_paths.createIndex({ account_id: 1, created_at: -1 });
db.map_paths.createIndex({ "origin.geo": "2dsphere" });
db.map_paths.createIndex({ "destination.geo": "2dsphere" });
