export interface AiAuditEntry {
  accountId: number;
  intent: string;
  outcome: 'accepted' | 'refused' | 'failed';
  at: number;
}

const buffer: AiAuditEntry[] = [];

export function recordAiAction(entry: AiAuditEntry): void {
  buffer.push(entry);
  if (buffer.length > 200) {
    buffer.shift();
  }
}

export function readAiActions(): AiAuditEntry[] {
  return [...buffer];
}
