import type { ApiClient } from './client';

export interface BindDeviceRequest {
  accountId: number;
  hardwareId: string;
  osVersion: string;
  appInstallId: string;
  screenClass: string;
}

export interface BindDeviceResponse {
  fingerprint: string;
}

export class IdentityApi {
  constructor(private readonly client: ApiClient) {}

  async bindDevice(input: BindDeviceRequest): Promise<BindDeviceResponse> {
    return this.client.post<BindDeviceResponse>('/v1/identity/device/bind', input);
  }
}
