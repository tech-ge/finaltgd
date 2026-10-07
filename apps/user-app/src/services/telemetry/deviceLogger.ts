export interface DeviceLogEvent {
  level: 'info' | 'warn' | 'error';
  event: string;
  metadata: Record<string, unknown>;
  at: number;
}

const buffer: DeviceLogEvent[] = [];
const MAX_BUFFER = 200;

export function logDeviceEvent(event: Omit<DeviceLogEvent, 'at'>): void {
  buffer.push({ ...event, at: Date.now() });
  if (buffer.length > MAX_BUFFER) {
    buffer.shift();
  }
}

export function readDeviceLog(): DeviceLogEvent[] {
  return [...buffer];
}

export function clearDeviceLog(): void {
  buffer.length = 0;
}
