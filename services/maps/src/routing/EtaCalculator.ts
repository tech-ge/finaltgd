export interface EtaSegment {
  lengthMeters: number;
  speedMps: number;
}

export function computeEtaSeconds(segments: EtaSegment[]): number {
  return segments.reduce((acc, s) => {
    if (s.speedMps <= 0) {
      throw new Error('invalid_speed');
    }
    return acc + s.lengthMeters / s.speedMps;
  }, 0);
}

export function computeCongestionScore(segments: EtaSegment[]): number {
  if (segments.length === 0) {
    return 0;
  }
  const ratios = segments.map((s) => {
    const referenceSpeed = 13.9;
    return Math.max(0, 1 - s.speedMps / referenceSpeed);
  });
  const avg = ratios.reduce((a, b) => a + b, 0) / ratios.length;
  return Number(avg.toFixed(4));
}
