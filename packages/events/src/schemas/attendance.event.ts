import { z } from 'zod';

export const AttendanceRecordedSchema = z.object({
  logId: z.number().int().positive(),
  employeeId: z.number().int().positive(),
  orgId: z.number().int().positive(),
  verifiedIp: z.string().min(1),
  verifiedLat: z.number().nullable(),
  verifiedLon: z.number().nullable(),
  status: z.enum(['AUTOMATIC_GEO_MATCH', 'FAILED_IP', 'FAILED_GEO', 'MANUAL_OVERRIDE']),
  recordedAt: z.string(),
});

export type AttendanceRecorded = z.infer<typeof AttendanceRecordedSchema>;
