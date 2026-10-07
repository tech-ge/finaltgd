import type { Pool } from 'pg';

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

export interface ReleaseEscrowInput {
  escrowId: number;
  releaseLat: number;
  releaseLon: number;
  biometricOk: boolean;
  idempotencyKey: string;
}

export class EscrowService {
  constructor(private readonly pool: Pool) {}

  async create(input: CreateEscrowInput): Promise<number> {
    const { rows } = await this.pool.query<{ fn_escrow_lock: number }>(
      'SELECT fn_escrow_lock($1, $2, $3, $4, $5, $6, $7, $8, $9) AS fn_escrow_lock',
      [
        input.fromAccount,
        input.toAccount,
        input.amount,
        input.reference,
        input.idempotencyKey,
        input.releaseLat ?? null,
        input.releaseLon ?? null,
        input.releaseRadiusM ?? 50,
        input.expiresInHours ?? 72,
      ],
    );

    const id = rows[0]?.fn_escrow_lock;
    if (id === undefined) {
      throw new Error('escrow_returned_no_id');
    }
    return id;
  }

  async release(input: ReleaseEscrowInput): Promise<number> {
    const { rows } = await this.pool.query<{ fn_escrow_release: number }>(
      'SELECT fn_escrow_release($1, $2, $3, $4, $5) AS fn_escrow_release',
      [
        input.escrowId,
        input.releaseLat,
        input.releaseLon,
        input.biometricOk,
        input.idempotencyKey,
      ],
    );

    const id = rows[0]?.fn_escrow_release;
    if (id === undefined) {
      throw new Error('escrow_release_returned_no_id');
    }
    return id;
  }
}
