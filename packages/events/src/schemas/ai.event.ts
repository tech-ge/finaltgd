import { z } from 'zod';

export const AiActionRecordedSchema = z.object({
  accountId: z.number().int().positive(),
  intent: z.string().min(1),
  outcome: z.enum(['accepted', 'refused', 'failed']),
  model: z.string().optional(),
  recordedAt: z.string(),
});

export const AiRestrictionScheduledSchema = z.object({
  restrictionId: z.number().int().positive(),
  accountId: z.number().int().positive(),
  reason: z.string().min(1),
  startsAt: z.string(),
  endsAt: z.string(),
});

export type AiActionRecorded = z.infer<typeof AiActionRecordedSchema>;
export type AiRestrictionScheduled = z.infer<typeof AiRestrictionScheduledSchema>;
