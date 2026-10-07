export interface FeatureFlags {
  twoFactorRequired: boolean;
  aiOrchestratorEnabled: boolean;
  voiceCloneEnabled: boolean;
  emergencyDialingEnabled: boolean;
  businessPortalEnabled: boolean;
  laptopMirrorEnabled: boolean;
  crossBorderSettlementEnabled: boolean;
  moveToEarnEnabled: boolean;
  fraudDetectionEnabled: boolean;
}

const DEFAULTS: FeatureFlags = {
  twoFactorRequired: false,
  aiOrchestratorEnabled: true,
  voiceCloneEnabled: true,
  emergencyDialingEnabled: true,
  businessPortalEnabled: true,
  laptopMirrorEnabled: true,
  crossBorderSettlementEnabled: true,
  moveToEarnEnabled: true,
  fraudDetectionEnabled: true,
};

let overrides: Partial<FeatureFlags> = {};

export function getFlags(): FeatureFlags {
  return { ...DEFAULTS, ...overrides };
}

export function setFlags(next: Partial<FeatureFlags>): void {
  overrides = { ...overrides, ...next };
}

export function resetFlags(): void {
  overrides = {};
}

export function isEnabled(flag: keyof FeatureFlags): boolean {
  return getFlags()[flag];
}
