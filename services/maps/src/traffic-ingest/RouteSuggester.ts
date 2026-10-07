import type { RouteOption } from '../routing/TwoPointRouter.js';
import type { CongestionReport } from './CongestionModel.js';

export interface SuggestionInput {
  routes: RouteOption[];
  congestion: CongestionReport[];
}

export interface Suggestion {
  routeId: string;
  reason: string;
}

export function suggest(input: SuggestionInput): Suggestion[] {
  const congestionBySegment = new Map(input.congestion.map((c) => [c.segmentId, c]));

  return input.routes
    .map((route) => {
      const matching = route.path
        .map((_, idx) => `${route.id}:${idx}`)
        .map((key) => congestionBySegment.get(key))
        .filter((c): c is CongestionReport => c !== undefined);

      const heavyCount = matching.filter(
        (c) => c.level === 'heavy' || c.level === 'severe',
      ).length;

      return {
        routeId: route.id,
        reason: heavyCount === 0 ? 'clear_route' : `congestion_segments: ${heavyCount}`,
      };
    })
    .sort((a, b) => a.reason.localeCompare(b.reason));
}
