import { z } from 'zod';

export const LocationObservedSchema = z.object({
  accountId: z.number().int().positive(),
  lat: z.number(),
  lon: z.number(),
  accuracyMeters: z.number().nonnegative().default(0),
  observedAt: z.string(),
});

export type LocationObserved = z.infer<typeof LocationObservedSchema>;
