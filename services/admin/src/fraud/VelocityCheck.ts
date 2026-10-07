export interface PositionSample {
  lat: number;
  lon: number;
  at: Date;
}

const MAX_SPEED_MPS = 90;

const EARTH_RADIUS_M = 6_371_000;

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

function distance(
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

export interface VelocityVerdict {
  impossible: boolean;
  observedSpeedMps: number;
}

export function checkVelocity(
  prev: PositionSample,
  curr: PositionSample,
): VelocityVerdict {
  const dt = (curr.at.getTime() - prev.at.getTime()) / 1000;
  if (dt <= 0) {
    return { impossible: true, observedSpeedMps: Number.POSITIVE_INFINITY };
  }
  const d = distance(prev.lat, prev.lon, curr.lat, curr.lon);
  const speed = d / dt;
  return { impossible: speed > MAX_SPEED_MPS, observedSpeedMps: speed };
}
