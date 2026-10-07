import { randomUUID } from 'node:crypto';

export interface GroupCallSession {
  sessionId: string;
  circleId: number;
  participants: number[];
  startedAt: Date;
}

export class GroupCallCoordinator {
  private readonly sessions = new Map<string, GroupCallSession>();

  start(circleId: number, participants: number[]): GroupCallSession {
    if (participants.length < 2) {
      throw new Error('group_call_needs_two_participants');
    }
    const session: GroupCallSession = {
      sessionId: randomUUID(),
      circleId,
      participants,
      startedAt: new Date(),
    };
    this.sessions.set(session.sessionId, session);
    return session;
  }

  end(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  list(circleId: number): GroupCallSession[] {
    return Array.from(this.sessions.values()).filter((s) => s.circleId === circleId);
  }
}
