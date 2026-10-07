import { RULE_BREACH_POLICY } from '../policies/rules-engine.policy.js';

export interface DetectorInput {
  code: string;
}

export interface DetectionResult {
  breached: boolean;
  code: string;
  restrictionDays: number;
}

export function detect(input: DetectorInput): DetectionResult {
  const match = RULE_BREACH_POLICY.find((r) => r.code === input.code);
  if (!match) {
    return { breached: false, code: input.code, restrictionDays: 0 };
  }
  return {
    breached: true,
    code: match.code,
    restrictionDays: match.restrictionDays,
  };
}
