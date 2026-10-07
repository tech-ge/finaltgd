import type { Pool } from 'pg';

import { evaluate } from './ConditionalRelease.js';
import { EscrowService } from './EscrowService.js';
import { withinRadius } from './GpsVerifier.js';

export interface SmartContractInput {
  escrowId: number;
  currentLat: number;
  currentLon: number;
  targetLat: number;
  targetLon: number;
  radiusM: number;
  biometricOk: boolean;
  notExpired: boolean;
  idempotencyKey: string;
}

export interface SmartContractResult {
  released: boolean;
  reason: string;
}

export class SmartContract {
  private readonly escrow: EscrowService;

  constructor(pool: Pool) {
    this.escrow = new EscrowService(pool);
  }

  async tryRelease(input: SmartContractInput): Promise<SmartContractResult> {
    const inside = withinRadius(
      input.currentLat,
      input.currentLon,
      input.targetLat,
      input.targetLon,
      input.radiusM,
    );

    const verdict = evaluate({
      withinRadius: inside,
      biometricOk: input.biometricOk,
      notExpired: input.notExpired,
      amount: undefined as never,
    });

    if (!verdict.release) {
      return { released: false, reason: verdict.reason };
    }

    await this.escrow.release({
      escrowId: input.escrowId,
      releaseLat: input.currentLat,
      releaseLon: input.currentLon,
      biometricOk: input.biometricOk,
      idempotencyKey: input.idempotencyKey,
    });

    return { released: true, reason: verdict.reason };
  }
}
