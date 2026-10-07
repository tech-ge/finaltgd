export interface CrashReport {
  message: string;
  stack: string | null;
  at: number;
}

const reports: CrashReport[] = [];

export function reportCrash(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack ?? null : null;
  reports.push({ message, stack, at: Date.now() });
}

export function readCrashes(): CrashReport[] {
  return [...reports];
}
