export interface AccelerometerSample {
  x: number;
  y: number;
  z: number;
  at: Date;
}

export function magnitude(sample: AccelerometerSample): number {
  return Math.sqrt(sample.x ** 2 + sample.y ** 2 + sample.z ** 2);
}

export function isStepSpike(prev: AccelerometerSample, curr: AccelerometerSample): boolean {
  const prevMag = magnitude(prev);
  const currMag = magnitude(curr);
  const delta = Math.abs(currMag - prevMag);
  return delta > 2.5;
}
