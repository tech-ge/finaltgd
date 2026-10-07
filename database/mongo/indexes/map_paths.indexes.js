db = db.getSiblingDB('techgeo');

db.map_paths.createIndex({ accountId: 1, createdAt: -1 });
db.map_paths.createIndex({ 'origin.geo': '2dsphere' });
db.map_paths.createIndex({ 'destination.geo': '2dsphere' });
db.map_paths.createIndex({ createdAt: -1 }, { expireAfterSeconds: 15552000 });

print('map_paths indexes created');
