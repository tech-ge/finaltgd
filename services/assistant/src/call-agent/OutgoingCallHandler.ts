export interface OutgoingCall {
  accountId: number;
  targetNumber: string;
  purpose: string;
}

export interface OutgoingPlan {
  permitted: boolean;
  reason: string;
}

export function plan(call: OutgoingCall): OutgoingPlan {
  if (call.purpose === 'emergency') {
    return { permitted: true, reason: 'emergency_bypass' };
  }
  if (!call.targetNumber || call.targetNumber.length < 6) {
    return { permitted: false, reason: 'invalid_target' };
  }
  return { permitted: true, reason: 'standard_outgoing' };
}
