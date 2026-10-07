export interface GoldLogCandidate {
  accountId: number;
  intent: string;
  outcome: string;
  latencyMs: number;
  hadError: boolean;
}

export interface ScoredLog extends GoldLogCandidate {
  score: number;
}

const MAX_LATENCY_MS = 5_000;

export function score(candidate: GoldLogCandidate): ScoredLog {
  let value = 1;

  if (candidate.hadError) {
    value -= 0.5;
  }
  if (candidate.latencyMs > MAX_LATENCY_MS) {
    value -= 0.25;
  }
  if (candidate.intent.trim().length === 0 || candidate.outcome.trim().length === 0) {
    value -= 0.5;
  }

  return { ...candidate, score: Math.max(0, Number(value.toFixed(4))) };
}

export function filterQuality(candidates: GoldLogCandidate[], minScore = 0.7): ScoredLog[] {
  return candidates
    .map(score)
    .filter((c) => c.score >= minScore);
}
