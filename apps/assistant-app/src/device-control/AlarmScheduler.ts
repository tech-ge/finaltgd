export interface ScheduledAlarm {
  at: number;
  label: string;
  createdBy: 'user' | 'assistant';
}

export function validateAlarm(alarm: ScheduledAlarm, now = Date.now()): void {
  if (alarm.at <= now) {
    throw new Error('alarm_must_be_in_future');
  }
  if (alarm.label.trim().length === 0) {
    throw new Error('alarm_label_required');
  }
}
