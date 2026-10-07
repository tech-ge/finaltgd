const EARTH_RADIUS_M = 6_371_000;

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function haversineMeters(
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
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_M * c;
}

export function withinRadius(
  currentLat: number,
  currentLon: number,
  targetLat: number,
  targetLon: number,
  radiusM: number,
): boolean {
  return haversineMeters(currentLat, currentLon, targetLat, targetLon) <= radiusM;
}

export function validateCoordinates(lat: number, lon: number): void {
  if (lat < -90 || lat > 90) {
    throw new Error('invalid_latitude');
  }
  if (lon < -180 || lon > 180) {
    throw new Error('invalid_longitude');
  }
}
