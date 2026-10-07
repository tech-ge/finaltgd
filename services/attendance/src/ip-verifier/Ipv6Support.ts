const IPV6_PATTERN = /^([0-9a-f]{0,4}:){2,7}[0-9a-f]{0,4}$/i;

export function isIpv6(ip: string): boolean {
  return IPV6_PATTERN.test(ip);
}

export function normalizeIp(ip: string): string {
  const trimmed = ip.trim().toLowerCase();
  if (isIpv6(trimmed)) {
    return trimmed.replace(/:0{1,4}/g, ':');
  }
  return trimmed;
}

export function ipMatches(expected: string, observed: string): boolean {
  return normalizeIp(expected) === normalizeIp(observed);
}
