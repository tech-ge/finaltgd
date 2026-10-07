export const TOPICS = {
  DEPOSIT_CONFIRMED: 'techgeo.deposit.confirmed.v1',
  TRANSFER_COMPLETED: 'techgeo.transfer.completed.v1',
  ESCROW_LOCKED: 'techgeo.escrow.locked.v1',
  ESCROW_RELEASED: 'techgeo.escrow.released.v1',
  LOCATION_OBSERVED: 'techgeo.location.observed.v1',
  ATTENDANCE_RECORDED: 'techgeo.attendance.recorded.v1',
  AI_ACTION_RECORDED: 'techgeo.ai.action.recorded.v1',
  AI_RESTRICTION_SCHEDULED: 'techgeo.ai.restriction.scheduled.v1',
  FRAUD_ALERT_RAISED: 'techgeo.fraud.alert.raised.v1',
  VOICE_ENROLLED: 'techgeo.voice.enrolled.v1',
  EMERGENCY_TRIGGERED: 'techgeo.emergency.triggered.v1',
} as const;

export type Topic = (typeof TOPICS)[keyof typeof TOPICS];

export function isValidTopic(value: string): value is Topic {
  return Object.values(TOPICS).includes(value as Topic);
}
