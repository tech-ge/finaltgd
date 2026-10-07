export interface OutgoingCall {
  targetNumber: string;
  purpose: 'normal' | 'emergency' | 'family';
}

export interface OutgoingPlan {
  permitted: boolean;
  reason: string;
}

export function planOutgoing(call: OutgoingCall): OutgoingPlan {
  if (call.purpose === 'emergency') {
    return { permitted: true, reason: 'emergency_bypass' };
  }
  if (call.targetNumber.trim().length < 6) {
    return { permitted: false, reason: 'invalid_number' };
  }
  return { permitted: true, reason: 'standard' };
}
