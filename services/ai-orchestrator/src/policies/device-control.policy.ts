export interface DeviceControlPolicy {
  action: string;
  requiresExplicitConsent: boolean;
  reversible: boolean;
  auditRequired: boolean;
}

export const DEVICE_CONTROL_POLICY: DeviceControlPolicy[] = [
  { action: 'screen.lock', requiresExplicitConsent: true, reversible: true, auditRequired: true },
  { action: 'sim.disable', requiresExplicitConsent: true, reversible: true, auditRequired: true },
  { action: 'app.block', requiresExplicitConsent: true, reversible: true, auditRequired: true },
  { action: 'alarm.schedule', requiresExplicitConsent: true, reversible: true, auditRequired: true },
  { action: 'mic.enable', requiresExplicitConsent: true, reversible: true, auditRequired: true },
  { action: 'speaker.enable', requiresExplicitConsent: true, reversible: true, auditRequired: true },
  { action: 'emergency.dial', requiresExplicitConsent: false, reversible: false, auditRequired: true },
];

export function find(action: string): DeviceControlPolicy | undefined {
  return DEVICE_CONTROL_POLICY.find((p) => p.action === action);
}
