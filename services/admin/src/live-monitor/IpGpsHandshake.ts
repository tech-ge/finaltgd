export interface HandshakeInput {
  orgId: number;
  employeeId: number;
  observedIp: string;
  observedLat: number;
  observedLon: number;
}

export interface HandshakeResult {
  accepted: boolean;
  reason: string;
}

const ALLOWED_RADIUS_M = 50;
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

export function evaluateHandshake(
  input: HandshakeInput,
  orgIp: string,
  orgLat: number,
  orgLon: number,
): HandshakeResult {
  if (input.observedIp.trim() !== orgIp.trim()) {
    return { accepted: false, reason: 'ip_mismatch' };
  }
  const d = distance(input.observedLat, input.observedLon, orgLat, orgLon);
  if (d > ALLOWED_RADIUS_M) {
    return { accepted: false, reason: 'outside_geofence' };
  }
  return { accepted: true, reason: 'dual_match' };
}
