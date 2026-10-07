export interface GyroscopeSample {
  x: number;
  y: number;
  z: number;
  at: Date;
}

export function rotationMagnitude(sample: GyroscopeSample): number {
  return Math.sqrt(sample.x ** 2 + sample.y ** 2 + sample.z ** 2);
}

export function isSleepStill(samples: GyroscopeSample[]): boolean {
  if (samples.length === 0) {
    return false;
  }
  const threshold = 0.05;
  return samples.every((s) => rotationMagnitude(s) < threshold);
}
