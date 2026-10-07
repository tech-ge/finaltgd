db = db.getSiblingDB('techgeo');
db.createCollection('user_intents');
db.user_intents.createIndex({ account_id: 1, created_at: -1 });
db.user_intents.createIndex({ resolved: 1 });
