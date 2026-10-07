import type { RouteOption } from './TwoPointRouter.js';

export interface ComparisonWeights {
  time: number;
  distance: number;
  congestion: number;
}

const DEFAULT_WEIGHTS: ComparisonWeights = { time: 0.6, distance: 0.2, congestion: 0.2 };

export function scoreRoute(route: RouteOption, weights = DEFAULT_WEIGHTS): number {
  const normalizedTime = route.etaSeconds / 3600;
  const normalizedDistance = route.distanceMeters / 10_000;
  const congestion = route.congestionScore;

  return (
    weights.time * normalizedTime +
    weights.distance * normalizedDistance +
    weights.congestion * congestion
  );
}

export function rankRoutes(routes: RouteOption[]): RouteOption[] {
  return [...routes].sort((a, b) => scoreRoute(a) - scoreRoute(b));
}
