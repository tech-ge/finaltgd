import { z } from 'zod';

export const EscrowLockedSchema = z.object({
  escrowId: z.number().int().positive(),
  reference: z.string().min(1),
  fromAccount: z.number().int().positive(),
  toAccount: z.number().int().positive(),
  amount: z.string(),
  expiresAt: z.string().nullable(),
  lockedAt: z.string(),
});

export const EscrowReleasedSchema = z.object({
  escrowId: z.number().int().positive(),
  reference: z.string().min(1),
  releaseLat: z.number(),
  releaseLon: z.number(),
  biometricOk: z.boolean(),
  releasedAt: z.string(),
});

export type EscrowLocked = z.infer<typeof EscrowLockedSchema>;
export type EscrowReleased = z.infer<typeof EscrowReleasedSchema>;
