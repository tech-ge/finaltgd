export interface DualLayerInput {
  ipMatches: boolean;
  insideGeofence: boolean;
}

export type VerificationStatus =
  | 'AUTOMATIC_GEO_MATCH'
  | 'FAILED_IP'
  | 'FAILED_GEO'
  | 'MANUAL_OVERRIDE';

export function classify(input: DualLayerInput): VerificationStatus {
  if (input.ipMatches && input.insideGeofence) {
    return 'AUTOMATIC_GEO_MATCH';
  }
  if (!input.ipMatches) {
    return 'FAILED_IP';
  }
  return 'FAILED_GEO';
}

export function isSuccess(status: VerificationStatus): boolean {
  return status === 'AUTOMATIC_GEO_MATCH' || status === 'MANUAL_OVERRIDE';
}
