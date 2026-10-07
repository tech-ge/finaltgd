export interface LockCommand {
  reason: string;
  expiresAt: number;
}

export interface LockVerdict {
  locked: boolean;
  reason: string;
}

export function shouldLock(command: LockCommand, now = Date.now()): LockVerdict {
  if (command.expiresAt <= now) {
    return { locked: false, reason: 'lock_expired' };
  }
  return { locked: true, reason: command.reason };
}
