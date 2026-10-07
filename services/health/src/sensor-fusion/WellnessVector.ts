export interface WellnessInput {
  activeMinutes: number;
  sleepMinutes: number;
  averageHeartRateBpm: number;
  stepCount: number;
}

export interface WellnessVector {
  activeScore: number;
  sleepScore: number;
  cardiovascularScore: number;
  compositeScore: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function buildVector(input: WellnessInput): WellnessVector {
  const activeScore = clamp(input.activeMinutes / 60, 0, 1);
  const sleepScore = clamp(input.sleepMinutes / 480, 0, 1);
  const hr = input.averageHeartRateBpm;
  const cardioDistance = hr === 0 ? 1 : Math.abs(hr - 65) / 65;
  const cardiovascularScore = clamp(1 - cardioDistance, 0, 1);

  const composite = Number(
    (0.4 * activeScore + 0.35 * sleepScore + 0.25 * cardiovascularScore).toFixed(4),
  );

  return { activeScore, sleepScore, cardiovascularScore, compositeScore: composite };
}
