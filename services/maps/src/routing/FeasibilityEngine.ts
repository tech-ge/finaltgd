import type { RouteOption } from './TwoPointRouter.js';

export interface FeasibilityVerdict {
  feasible: boolean;
  slackSeconds: number;
  bestRoute: RouteOption | null;
}

export function evaluate(
  options: RouteOption[],
  availableSeconds: number,
): FeasibilityVerdict {
  if (options.length === 0) {
    return { feasible: false, slackSeconds: 0, bestRoute: null };
  }

  const sorted = [...options].sort((a, b) => a.etaSeconds - b.etaSeconds);
  const best = sorted[0] ?? null;
  if (!best) {
    return { feasible: false, slackSeconds: 0, bestRoute: null };
  }

  const slack = availableSeconds - best.etaSeconds;
  return {
    feasible: slack >= 0,
    slackSeconds: slack,
    bestRoute: best,
  };
}
