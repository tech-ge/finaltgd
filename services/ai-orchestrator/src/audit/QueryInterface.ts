import type { ImmutableTrail, TrailEntry } from './ImmutableTrail.js';

export interface QueryOptions {
  fromSequence: number;
  limit: number;
}

export class QueryInterface {
  constructor(private readonly trail: ImmutableTrail) {}

  read(options: QueryOptions): TrailEntry[] {
    return this.trail
      .entries_()
      .filter((e) => e.sequence >= options.fromSequence)
      .slice(0, options.limit);
  }

  count(): number {
    return this.trail.length();
  }
}
