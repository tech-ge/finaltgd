import { z } from 'zod';

export const TransferCompletedSchema = z.object({
  transferId: z.number().int().positive(),
  operation: z.enum([
    'DEPOSIT_FIAT',
    'SEND_INTERNAL',
    'SEND_BUSINESS',
    'ESCROW_LOCK',
    'ESCROW_RELEASE',
    'MOVE_TO_EARN',
  ]),
  fromAccount: z.number().int().positive().nullable(),
  toAccount: z.number().int().positive(),
  amount: z.string(),
  currencyCode: z.string().length(3),
  reference: z.string().min(1),
  idempotencyKey: z.string().min(1),
  completedAt: z.string(),
});

export type TransferCompleted = z.infer<typeof TransferCompletedSchema>;
