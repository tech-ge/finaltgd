import type { Pool } from 'pg';

import { FiatIngestion, type FiatIngestInput } from './FiatIngestion.js';

export class MintPipeline {
  private readonly ingestion: FiatIngestion;

  constructor(pool: Pool) {
    this.ingestion = new FiatIngestion(pool);
  }

  async run(input: FiatIngestInput): Promise<{ depositId: number }> {
    const depositId = await this.ingestion.confirmDeposit(input);
    return { depositId };
  }
}
