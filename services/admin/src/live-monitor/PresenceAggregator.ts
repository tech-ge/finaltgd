export interface PresenceRow {
  employeeId: number;
  fullName: string;
  role: string;
  lastSeenAt: Date;
  status: string;
}

export interface LiveSnapshot {
  orgId: number;
  capturedAt: Date;
  totalEmployees: number;
  present: number;
  absent: number;
  employees: PresenceRow[];
}

export function buildSnapshot(
  orgId: number,
  employees: PresenceRow[],
  totalEmployees: number,
): LiveSnapshot {
  return {
    orgId,
    capturedAt: new Date(),
    totalEmployees,
    present: employees.length,
    absent: Math.max(0, totalEmployees - employees.length),
    employees,
  };
}
