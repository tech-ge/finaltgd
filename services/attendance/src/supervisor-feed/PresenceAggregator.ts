export interface PresenceRow {
  employeeId: number;
  fullName: string;
  role: string;
  lastSeenAt: Date;
  status: string;
}

export interface PresenceSnapshot {
  orgId: number;
  capturedAt: Date;
  present: PresenceRow[];
  absent: number;
}

export function buildSnapshot(
  orgId: number,
  rows: PresenceRow[],
  totalEmployees: number,
): PresenceSnapshot {
  return {
    orgId,
    capturedAt: new Date(),
    present: rows,
    absent: Math.max(0, totalEmployees - rows.length),
  };
}
