export const COLLECTIONS = {
  ACTIVITY_LOGS: 'activity_logs',
  GOLD_LOGS: 'gold_logs',
  VOICE_PROFILES: 'voice_profiles',
  MAP_PATHS: 'map_paths',
  TRAFFIC_STOPS: 'traffic_stops',
  WEATHER_SNAPSHOTS: 'weather_snapshots',
  AI_EVENTS: 'ai_events',
  USER_INTENTS: 'user_intents',
} as const;

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

export function isValidCollection(name: string): name is CollectionName {
  return Object.values(COLLECTIONS).includes(name as CollectionName);
}
