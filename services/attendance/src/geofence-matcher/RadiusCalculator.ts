export interface RadiusInput {
  centerLat: number;
  centerLon: number;
  pointLat: number;
  pointLon: number;
  allowedRadiusM: number;
}

import { haversineMeters } from './HaversineDistance.js';

export function distanceFromCenter(input: RadiusInput): number {
  return haversineMeters(input.centerLat, input.centerLon, input.pointLat, input.pointLon);
}

export function insideRadius(input: RadiusInput): boolean {
  return distanceFromCenter(input) <= input.allowedRadiusM;
}
