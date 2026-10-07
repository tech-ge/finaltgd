export interface StepBatch {
  accountId: number;
  steps: number;
  startedAt: number;
  endedAt: number;
}

let lastBatch: StepBatch | null = null;

export function recordStepBatch(batch: StepBatch): void {
  lastBatch = batch;
}

export function getLastStepBatch(): StepBatch | null {
  return lastBatch;
}
