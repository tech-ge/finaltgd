export interface CallLogEntry {
  accountId: number;
  callerNumber: string;
  durationSeconds: number;
  outcome: string;
  at: Date;
}

export class CallRecorder {
  private readonly log: CallLogEntry[] = [];

  record(entry: CallLogEntry): void {
    if (entry.durationSeconds < 0) {
      throw new Error('invalid_duration');
    }
    this.log.push(entry);
  }

  history(accountId: number): CallLogEntry[] {
    return this.log.filter((e) => e.accountId === accountId);
  }
}
