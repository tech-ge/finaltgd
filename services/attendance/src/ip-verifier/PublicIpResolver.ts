export interface IpHeaders {
  forwardedFor?: string;
  realIp?: string;
  connectingIp?: string;
}

const PRIVATE_RANGES = [
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[01])\./,
  /^192\.168\./,
  /^127\./,
  /^169\.254\./,
  /^fc00:/i,
  /^fe80:/i,
];

export function isPrivateIp(ip: string): boolean {
  return PRIVATE_RANGES.some((pattern) => pattern.test(ip));
}

export function resolvePublicIp(headers: IpHeaders): string | null {
  const candidates = [
    headers.connectingIp,
    headers.realIp,
    headers.forwardedFor?.split(',')[0]?.trim(),
  ].filter((v): v is string => typeof v === 'string' && v.length > 0);

  for (const candidate of candidates) {
    if (!isPrivateIp(candidate)) {
      return candidate;
    }
  }
  return null;
}
