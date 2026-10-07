export interface ConsentRecord {
  accountId: number;
  scope: string;
  granted: boolean;
  recordedAt: Date;
}

export class ConsentTracker {
  private readonly records = new Map<string, ConsentRecord>();

  private key(accountId: number, scope: string): string {
    return `${accountId}:${scope}`;
  }

  record(record: ConsentRecord): void {
    this.records.set(this.key(record.accountId, record.scope), record);
  }

  has(accountId: number, scope: string): boolean {
    const record = this.records.get(this.key(accountId, scope));
    return record?.granted === true;
  }

  revoke(accountId: number, scope: string): void {
    this.records.set(this.key(accountId, scope), {
      accountId,
      scope,
      granted: false,
      recordedAt: new Date(),
    });
  }

  listFor(accountId: number): ConsentRecord[] {
    return Array.from(this.records.values()).filter((r) => r.accountId === accountId);
  }
}
