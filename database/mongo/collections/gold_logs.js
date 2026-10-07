db = db.getSiblingDB('techgeo');
db.createCollection('gold_logs');
db.gold_logs.createIndex({ account_id: 1, created_at: -1 });
db.gold_logs.createIndex({ quality_score: -1 });
db.gold_logs.createIndex({ exported: 1 });
