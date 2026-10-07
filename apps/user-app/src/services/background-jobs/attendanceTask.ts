export interface AttendanceAttempt {
  employeeId: number;
  orgId: number;
  lat: number;
  lon: number;
  attemptedAt: number;
  result: 'success' | 'failed';
}

const attempts: AttendanceAttempt[] = [];

export function recordAttempt(attempt: AttendanceAttempt): void {
  attempts.push(attempt);
  if (attempts.length > 100) {
    attempts.shift();
  }
}

export function readAttempts(): AttendanceAttempt[] {
  return [...attempts];
}
