export interface LockCommand {
  accountId: number;
  reason: string;
  expiresAt: Date;
}

export interface LockVerdict {
  locked: boolean;
  reason: string;
}

export function shouldLock(command: LockCommand, now = new Date()): LockVerdict {
  if (now > command.expiresAt) {
    return { locked: false, reason: 'lock_expired' };
  }
  return { locked: true, reason: command.reason };
}
