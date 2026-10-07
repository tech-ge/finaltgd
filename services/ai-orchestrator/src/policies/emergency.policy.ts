export const EMERGENCY_POLICY = {
  allowedTriggers: ['accident.detected', 'health.crisis', 'voice.distress', 'manual'] as const,
  bypassRuleRestrictions: true,
  notifyFamilyCircle: true,
  dialEmergencyServices: true,
  preserveEvidence: true,
  rateLimitWindowSeconds: 30,
} as const;
