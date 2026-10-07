import type { Scope } from '../context-broker/ScopedPermission.js';

export interface PolicyRule {
  scope: Scope;
  description: string;
  requiresExplicitConsent: boolean;
  logLevel: 'info' | 'warn';
}

export const DATA_ACCESS_POLICY: PolicyRule[] = [
  {
    scope: 'balance.read',
    description: 'Read current TGD balance only. Never historical ledger entries.',
    requiresExplicitConsent: true,
    logLevel: 'info',
  },
  {
    scope: 'activity.read',
    description: 'Read last 20 ledger transfer summaries for the account.',
    requiresExplicitConsent: true,
    logLevel: 'info',
  },
  {
    scope: 'location.read',
    description: 'Read coarse position. Never raw GPS trace.',
    requiresExplicitConsent: true,
    logLevel: 'warn',
  },
  {
    scope: 'microphone.read',
    description: 'Return transcribed snippet only. Never store raw audio.',
    requiresExplicitConsent: true,
    logLevel: 'warn',
  },
  {
    scope: 'health.read',
    description: 'Read wellness vector. Never diagnose. Never recommend treatment.',
    requiresExplicitConsent: true,
    logLevel: 'warn',
  },
  {
    scope: 'business.read',
    description: 'Read business aggregate metrics for the caller org only.',
    requiresExplicitConsent: true,
    logLevel: 'info',
  },
  {
    scope: 'call.history.read',
    description: 'Read call history metadata. Never store call recordings.',
    requiresExplicitConsent: true,
    logLevel: 'warn',
  },
];

export function findRule(scope: Scope): PolicyRule | undefined {
  return DATA_ACCESS_POLICY.find((r) => r.scope === scope);
}
