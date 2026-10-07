db = db.getSiblingDB('techgeo');
db.createCollection('activity_logs');
db.activity_logs.createIndex({ account_id: 1, created_at: -1 });
db.activity_logs.createIndex({ event_type: 1, created_at: -1 });
