import type { ImmutableTrail } from './ImmutableTrail.js';

export interface QueryOptions {
  fromSequence: number;
  limit: number;
}

export class QueryInterface {
  constructor(private readonly trail: ImmutableTrail) {}

  read(options: QueryOptions): unknown[] {
    return this.trail
      .entries_()
      .filter((e) => e.sequence >= options.fromSequence)
      .slice(0, options.limit)
      .map((e) => e.payload);
  }

  count(): number {
    return this.trail.entries_().length;
  }
}
