import type { Pool } from 'pg';

import { EscrowService } from './EscrowService.js';
import { canRelease, reasonForRefusal, type ReleaseConditions } from './ConditionalRelease.js';
import { withinRadius } from './GpsVerifier.js';

export class SmartContract {
  private readonly escrow: EscrowService;

  constructor(private readonly pool: Pool) {
    this.escrow = new EscrowService(pool);
  }

  async create(input: Parameters<EscrowService['create']>[0]): Promise<number> {
    return this.escrow.create(input);
  }

  async tryRelease(input: {
    escrowId: number;
    currentLat: number;
    currentLon: number;
    targetLat: number;
    targetLon: number;
    radiusM: number;
    biometricOk: boolean;
    notExpired: boolean;
    idempotencyKey: string;
  }): Promise<{ released: boolean; reason?: string }> {
    const conditions: ReleaseConditions = {
      withinRadius: withinRadius(
        input.currentLat,
        input.currentLon,
        input.targetLat,
        input.targetLon,
        input.radiusM,
      ),
      biometricOk: input.biometricOk,
      notExpired: input.notExpired,
    };

    if (!canRelease(conditions)) {
      return { released: false, reason: reasonForRefusal(conditions) ?? 'unknown' };
    }

    await this.escrow.release({
      escrowId: input.escrowId,
      releaseLat: input.currentLat,
      releaseLon: input.currentLon,
      biometricOk: input.biometricOk,
      idempotencyKey: input.idempotencyKey,
    });

    return { released: true };
  }
}
