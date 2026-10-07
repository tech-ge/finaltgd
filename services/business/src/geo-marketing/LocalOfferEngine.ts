import type { Campaign } from './GeoFenceCampaign.js';
import { isActive } from './GeoFenceCampaign.js';

const EARTH_RADIUS_M = 6_371_000;

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

function distanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_M * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export interface OfferMatch {
  campaignId: string;
  message: string;
  distanceMeters: number;
}

export function match(
  campaigns: Campaign[],
  customerLat: number,
  customerLon: number,
  now = new Date(),
): OfferMatch[] {
  return campaigns
    .filter((c) => isActive(c, now))
    .map((c) => ({
      campaignId: c.id,
      message: c.message,
      distanceMeters: distanceMeters(c.centerLat, c.centerLon, customerLat, customerLon),
    }))
    .filter((m) => {
      const campaign = campaigns.find((c) => c.id === m.campaignId);
      return campaign !== undefined && m.distanceMeters <= campaign.radiusMeters;
    });
}
