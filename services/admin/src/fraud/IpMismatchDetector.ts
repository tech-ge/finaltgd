export interface IpObservation {
  employeeId: number;
  observedIp: string;
  observedAt: Date;
}

export interface MismatchVerdict {
  employeeId: number;
  mismatched: boolean;
  observedIp: string;
}

export function detect(
  observations: IpObservation[],
  registeredIp: string,
): MismatchVerdict[] {
  return observations.map((o) => ({
    employeeId: o.employeeId,
    mismatched: o.observedIp.trim() !== registeredIp.trim(),
    observedIp: o.observedIp,
  }));
}
