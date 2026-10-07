import type { ModelName } from './ModelSelector.js';

export interface FallbackStep {
  model: ModelName;
  available: boolean;
}

export function pickFirstAvailable(steps: FallbackStep[]): ModelName | null {
  const found = steps.find((s) => s.available);
  return found ? found.model : null;
}

export const DEFAULT_CHAIN: ModelName[] = [
  'shadow-student',
  'voice-clone',
  'speech-analytics',
];
