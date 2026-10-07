export interface DelayInput {
  baselineEtaSeconds: number;
  currentCongestionScore: number;
  historicalCongestionScore: number;
}

export function predictDelaySeconds(input: DelayInput): number {
  const ratio =
    input.historicalCongestionScore > 0
      ? input.currentCongestionScore / input.historicalCongestionScore
      : 1;

  const clamped = Math.min(Math.max(ratio, 0.5), 3);
  const extra = input.baselineEtaSeconds * (clamped - 1);
  return Math.round(extra);
}
