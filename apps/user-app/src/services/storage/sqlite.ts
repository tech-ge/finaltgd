export interface PendingTransfer {
  idempotencyKey: string;
  payload: string;
  createdAt: number;
}

const memoryStore = new Map<string, PendingTransfer>();

export function queuePendingTransfer(entry: PendingTransfer): void {
  memoryStore.set(entry.idempotencyKey, entry);
}

export function drainPendingTransfers(): PendingTransfer[] {
  const all = Array.from(memoryStore.values());
  memoryStore.clear();
  return all;
}

export function pendingCount(): number {
  return memoryStore.size;
}
