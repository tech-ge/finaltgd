import { createHash } from 'node:crypto';

export interface TrailEntry {
  sequence: number;
  previousHash: string;
  payloadHash: string;
  payload: unknown;
  at: number;
}

export class ImmutableTrail {
  private readonly entries: TrailEntry[] = [];

  append(payload: unknown): TrailEntry {
    const previous = this.entries[this.entries.length - 1];
    const previousHash = previous ? previous.payloadHash : 'genesis';
    const payloadString = JSON.stringify(payload);
    const payloadHash = createHash('sha256').update(payloadString).digest('hex');
    const entry: TrailEntry = {
      sequence: this.entries.length,
      previousHash,
      payloadHash,
      payload,
      at: Date.now(),
    };
    this.entries.push(entry);
    return entry;
  }

  verify(): boolean {
    for (let i = 0; i < this.entries.length; i += 1) {
      const entry = this.entries[i];
      const prev = this.entries[i - 1];
      if (!entry) {
        return false;
      }
      const expectedPrev = prev ? prev.payloadHash : 'genesis';
      if (entry.previousHash !== expectedPrev) {
        return false;
      }
      const expectedHash = createHash('sha256')
        .update(JSON.stringify(entry.payload))
        .digest('hex');
      if (entry.payloadHash !== expectedHash) {
        return false;
      }
    }
    return true;
  }

  entries_(): TrailEntry[] {
    return [...this.entries];
  }

  length(): number {
    return this.entries.length;
  }
}
