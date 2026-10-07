import { z } from 'zod';

export const DepositConfirmedSchema = z.object({
  depositId: z.number().int().positive(),
  accountId: z.number().int().positive(),
  fiatAmount: z.string(),
  fiatCurrency: z.string().length(3),
  appliedRate: z.string(),
  tgdCredited: z.string(),
  gatewayReference: z.string().min(1),
  gatewayName: z.string().min(1),
  confirmedAt: z.string(),
});

export type DepositConfirmed = z.infer<typeof DepositConfirmedSchema>;
