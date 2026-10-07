export interface Coordinate {
  lat: number;
  lon: number;
}

export interface RouteOption {
  id: string;
  path: Coordinate[];
  distanceMeters: number;
  etaSeconds: number;
  congestionScore: number;
}

export interface RouteRequest {
  origin: Coordinate;
  destination: Coordinate;
  departAt: Date;
}

export interface WeatherSnapshot {
  temperatureC: number;
  precipitationMm: number;
  windKph: number;
  condition: string;
  capturedAt: Date;
}

export type CongestionLevel = 'free' | 'light' | 'moderate' | 'heavy' | 'severe';

export interface CongestionReport {
  segmentId: string;
  level: CongestionLevel;
  speedMps: number;
}

export interface MeetupZone {
  centerLat: number;
  centerLon: number;
  radiusMeters: number;
}
