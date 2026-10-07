export interface EmergencyPlan {
  shouldDialEmergencyServices: boolean;
  primaryContacts: string[];
  reason: string;
}

export interface EmergencyContext {
  trigger: 'accident' | 'health' | 'voice_distress' | 'manual';
  contacts: string[];
}

export function planEmergency(context: EmergencyContext): EmergencyPlan {
  const shouldDial = context.trigger !== 'manual';
  return {
    shouldDialEmergencyServices: shouldDial,
    primaryContacts: context.contacts.slice(0, 2),
    reason: `trigger: ${context.trigger}`,
  };
}
