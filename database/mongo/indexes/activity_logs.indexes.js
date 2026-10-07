db = db.getSiblingDB('techgeo');

db.activity_logs.createIndex({ accountId: 1, createdAt: -1 });
db.activity_logs.createIndex({ eventType: 1, createdAt: -1 });
db.activity_logs.createIndex({ orgId: 1, createdAt: -1 });
db.activity_logs.createIndex({ createdAt: -1 }, { expireAfterSeconds: 7776000 });

print('activity_logs indexes created');
