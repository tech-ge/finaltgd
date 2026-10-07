export interface Party {
  accountId: number;
  lat: number;
  lon: number;
}

export interface Visibility {
  from: number;
  to: number;
  distanceMeters: number;
}

export function visiblePairs(parties: Party[], maxMeters: number): Visibility[] {
  const result: Visibility[] = [];
  for (let i = 0; i < parties.length; i += 1) {
    for (let j = i + 1; j < parties.length; j += 1) {
      const a = parties[i];
      const b = parties[j];
      if (!a || !b) {
        continue;
      }
      const dLat = ((b.lat - a.lat) * Math.PI) / 180;
      const dLon = ((b.lon - a.lon) * Math.PI) / 180;
      const lat1 = (a.lat * Math.PI) / 180;
      const lat2 = (b.lat * Math.PI) / 180;
      const h =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
      const d = 6_371_000 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));

      if (d <= maxMeters) {
        result.push({ from: a.accountId, to: b.accountId, distanceMeters: d });
      }
    }
  }
  return result;
}
