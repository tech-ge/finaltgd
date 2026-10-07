import { AppError } from './AppError.js';

export class PolicyError extends AppError {
  constructor(code: string, message: string, metadata: Record<string, unknown> = {}) {
    super(code, message, 403, metadata);
    this.name = 'PolicyError';
  }
}

export const POLICY_ERRORS = {
  AI_RESTRICTED: 'ai_restricted',
  CONSENT_MISSING: 'consent_missing',
  ROLE_NOT_PERMITTED: 'role_not_permitted',
  COMMANDS_NOT_PERMITTED: 'commands_are_not_permitted',
  VOICE_VAULT_OWNERSHIP_DENIED: 'voice_vault_ownership_denied',
  TWO_PERSON_RULE_VIOLATED: 'two_person_rule_violated',
} as const;
