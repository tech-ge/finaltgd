import type { Pool } from 'pg';

import { MintPipeline, type MintInput, type MintResult } from './MintPipeline.js';

export class FiatIngestion {
  private readonly pipeline: MintPipeline;

  constructor(pool: Pool) {
    this.pipeline = new MintPipeline(pool);
  }

  async confirmDeposit(input: MintInput): Promise<MintResult> {
    return this.pipeline.run(input);
  }
}
