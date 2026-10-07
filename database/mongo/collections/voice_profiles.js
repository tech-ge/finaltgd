db = db.getSiblingDB('techgeo');
db.createCollection('voice_profiles');
db.voice_profiles.createIndex({ account_id: 1 }, { unique: true });
