export interface ArrivalCheck {
  employeeId: number;
  ipMatches: boolean;
  insideGeofence: boolean;
}

export interface ArrivalVerdict {
  employeeId: number;
  arrived: boolean;
  reason: string;
}

export function verdict(check: ArrivalCheck): ArrivalVerdict {
  if (check.ipMatches && check.insideGeofence) {
    return { employeeId: check.employeeId, arrived: true, reason: 'dual_match' };
  }
  if (!check.ipMatches) {
    return { employeeId: check.employeeId, arrived: false, reason: 'ip_mismatch' };
  }
  return { employeeId: check.employeeId, arrived: false, reason: 'outside_geofence' };
}
