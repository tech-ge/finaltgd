import type { TechGeoLedgerClient } from './TechGeoLedgerClient.js';

export interface CreateEscrowInput {
  fromAccount: number;
  toAccount: number;
  amount: string;
  reference: string;
  idempotencyKey: string;
  releaseLat?: number;
  releaseLon?: number;
  releaseRadiusM?: number;
  expiresInHours?: number;
}

export interface CreateEscrowResult {
  escrowId: number;
}

export interface ReleaseEscrowInput {
  escrowId: number;
  releaseLat: number;
  releaseLon: number;
  biometricOk: boolean;
  idempotencyKey: string;
}

export interface ReleaseEscrowResult {
  escrowId: number;
}

export class EscrowClient {
  constructor(private readonly client: TechGeoLedgerClient) {}

  async create(input: CreateEscrowInput): Promise<CreateEscrowResult> {
    const response = await this.client.request<CreateEscrowResult>({
      path: '/escrow',
      body: input,
    });
    if (!response.ok || !response.data) {
      throw new Error(`escrow_create_failed_status_${response.status}`);
    }
    return response.data;
  }

  async release(input: ReleaseEscrowInput): Promise<ReleaseEscrowResult> {
    const response = await this.client.request<ReleaseEscrowResult>({
      path: '/escrow/release',
      body: input,
    });
    if (!response.ok || !response.data) {
      throw new Error(`escrow_release_failed_status_${response.status}`);
    }
    return response.data;
  }
}
