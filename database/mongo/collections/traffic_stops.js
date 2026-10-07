db = db.getSiblingDB('techgeo');
db.createCollection('traffic_stops');
db.traffic_stops.createIndex({ "segment.geo": "2dsphere" });
db.traffic_stops.createIndex({ observed_at: -1 });
