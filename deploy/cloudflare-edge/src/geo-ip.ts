export interface GeoLookup {
  country: string;
  region: string;
  city: string;
}

interface RequestWithCf {
  cf?: {
    country?: string;
    region?: string;
    city?: string;
  };
}

export function lookupGeoIp(request: Request): GeoLookup {
  const cf = (request as Request & RequestWithCf).cf;
  return {
    country: cf?.country ?? 'unknown',
    region: cf?.region ?? 'unknown',
    city: cf?.city ?? 'unknown',
  };
}
