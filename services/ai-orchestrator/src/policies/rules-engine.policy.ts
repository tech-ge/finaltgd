export interface RuleBreach {
  code: string;
  description: string;
  restrictionDays: number;
}

export const RULE_BREACH_POLICY: RuleBreach[] = [
  {
    code: 'attempt_withdrawal',
    description: 'Attempted withdrawal operation',
    restrictionDays: 2,
  },
  {
    code: 'abusive_ai_prompt',
    description: 'Prompted AI for forbidden operation',
    restrictionDays: 2,
  },
  {
    code: 'unauthorized_agent_command',
    description: 'Attempted to command another agent',
    restrictionDays: 2,
  },
  {
    code: 'voice_impersonation',
    description: 'Attempted cross-account voice use',
    restrictionDays: 2,
  },
];

export const RESTRICTION_DAYS_DEFAULT = 2;
export const EMERGENCY_BYPASS = true;
