db = db.getSiblingDB('techgeo');
db.createCollection('ai_events');
db.ai_events.createIndex({ account_id: 1, created_at: -1 });
db.ai_events.createIndex({ intent: 1, created_at: -1 });
