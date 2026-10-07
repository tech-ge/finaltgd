import type { ApiClient } from './client';

export interface CheckInRequest {
  employeeId: number;
  orgId: number;
  observedLat: number;
  observedLon: number;
}

export interface CheckInResponse {
  logId: number;
  status: string;
  distanceMeters: number;
}

export class AttendanceApi {
  constructor(private readonly client: ApiClient) {}

  async checkIn(input: CheckInRequest): Promise<CheckInResponse> {
    return this.client.post<CheckInResponse>('/v1/attendance/checkin', input);
  }
}
