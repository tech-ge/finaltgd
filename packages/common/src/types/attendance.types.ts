export type VerificationStatus =
  | 'AUTOMATIC_GEO_MATCH'
  | 'FAILED_IP'
  | 'FAILED_GEO'
  | 'MANUAL_OVERRIDE';

export interface AttendanceLog {
  logId: number;
  employeeId: number;
  clockInTime: Date;
  verifiedIp: string;
  verifiedLatitude: number | null;
  verifiedLongitude: number | null;
  verificationStatus: VerificationStatus;
  createdAt: Date;
}

export interface HandshakeInput {
  employeeId: number;
  observedIp: string;
  observedLat: number;
  observedLon: number;
  orgIp: string;
  orgLat: number;
  orgLon: number;
}

export interface HandshakeResult {
  accepted: boolean;
  reason: string;
}
