db = db.getSiblingDB('techgeo');

db.createCollection('activity_logs');
db.createCollection('gold_logs');
db.createCollection('voice_profiles');
db.createCollection('map_paths');
db.createCollection('traffic_stops');
db.createCollection('weather_snapshots');
db.createCollection('ai_events');
db.createCollection('user_intents');

print('TechGeo Mongo collections created');
