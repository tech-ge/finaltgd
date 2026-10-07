export interface ScheduledAlarm {
  accountId: number;
  at: Date;
  label: string;
  createdBy: 'user' | 'assistant';
}

export function validate(alarm: ScheduledAlarm, now = new Date()): void {
  if (alarm.at <= now) {
    throw new Error('alarm_must_be_in_future');
  }
  if (alarm.label.trim().length === 0) {
    throw new Error('alarm_label_required');
  }
}
