db = db.getSiblingDB('techgeo');

db.gold_logs.createIndex({ accountId: 1, createdAt: -1 });
db.gold_logs.createIndex({ qualityScore: -1 });
db.gold_logs.createIndex({ exported: 1, qualityScore: -1 });
db.gold_logs.createIndex({ intent: 1, outcome: 1 });

print('gold_logs indexes created');
