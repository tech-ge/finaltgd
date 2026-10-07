db = db.getSiblingDB('techgeo');

const collections = [
  'activity_logs',
  'gold_logs',
  'voice_profiles',
  'map_paths',
  'traffic_stops',
  'weather_snapshots',
  'ai_events',
  'user_intents',
];

for (const name of collections) {
  if (!db.getCollectionNames().includes(name)) {
    db.createCollection(name);
  }
}

print('collections initialized');
