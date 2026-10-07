export interface AudioControlCommand {
  accountId: number;
  enableMic: boolean;
  enableSpeaker: boolean;
  reason: string;
  expiresAt: Date;
}

export function isActive(command: AudioControlCommand, now = new Date()): boolean {
  return now <= command.expiresAt;
}
