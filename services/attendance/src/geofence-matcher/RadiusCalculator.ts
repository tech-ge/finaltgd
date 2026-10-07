import { haversineMeters } from './HaversineDistance.js';

export interface RadiusInput {
  centerLat: number;
  centerLon: number;
  pointLat: number;
  pointLon: number;
  allowedRadiusM: number;
}

export function distanceFromCenter(input: RadiusInput): number {
  return haversineMeters(input.centerLat, input.centerLon, input.pointLat, input.pointLon);
}

export function insideRadius(input: RadiusInput): boolean {
  return distanceFromCenter(input) <= input.allowedRadiusM;
}

export function validateCoordinates(lat: number, lon: number): void {
  if (lat < -90 || lat > 90) {
    throw new Error('invalid_latitude');
  }
  if (lon < -180 || lon > 180) {
    throw new Error('invalid_longitude');
  }
}
