import type { EmergencyContact } from './EmergencyContacts.js';

export interface DialRequest {
  accountId: number;
  trigger: 'accident.detected' | 'health.crisis' | 'voice.distress' | 'manual';
  location?: { lat: number; lon: number };
}

export interface DialPlan {
  contacts: EmergencyContact[];
  shouldDialEmergencyServices: boolean;
}

export class AutoDialer {
  constructor(private readonly lookup: (accountId: number) => EmergencyContact[]) {}

  plan(request: DialRequest): DialPlan {
    const contacts = this.lookup(request.accountId);
    const primary = contacts.filter((c) => c.priority <= 2);
    const shouldDial = request.trigger !== 'manual';
    return {
      contacts: primary,
      shouldDialEmergencyServices: shouldDial,
    };
  }
}
