import type { Db, Collection, Document } from 'mongodb';

export interface ExtractOptions {
  sinceIso: string;
  limit: number;
}

export interface GoldLogDocument extends Document {
  accountId: number;
  intent: string;
  outcome: string;
  latencyMs: number;
  hadError: boolean;
  createdAt: Date;
}

export class GoldLogExtractor {
  private readonly collection: Collection<GoldLogDocument>;

  constructor(db: Db) {
    this.collection = db.collection<GoldLogDocument>('gold_logs');
  }

  async extract(options: ExtractOptions): Promise<GoldLogDocument[]> {
    return this.collection
      .find({ createdAt: { $gte: new Date(options.sinceIso) } })
      .sort({ createdAt: -1 })
      .limit(options.limit)
      .toArray();
  }
}
