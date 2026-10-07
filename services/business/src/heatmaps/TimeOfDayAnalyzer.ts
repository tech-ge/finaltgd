export interface HourlyBucket {
  hour: number;
  count: number;
}

export interface TimeOfDayProfile {
  hours: HourlyBucket[];
  peakHour: number;
  quietHour: number;
}

export function analyze(events: Array<{ observedAt: Date }>): TimeOfDayProfile {
  const counts = new Array<number>(24).fill(0);

  for (const e of events) {
    const hour = e.observedAt.getHours();
    counts[hour] = (counts[hour] ?? 0) + 1;
  }

  const hours: HourlyBucket[] = counts.map((count, hour) => ({ hour, count }));

  let peakHour = 0;
  let quietHour = 0;
  for (let i = 1; i < 24; i += 1) {
    if ((counts[i] ?? 0) > (counts[peakHour] ?? 0)) {
      peakHour = i;
    }
    if ((counts[i] ?? 0) < (counts[quietHour] ?? 0)) {
      quietHour = i;
    }
  }

  return { hours, peakHour, quietHour };
}
