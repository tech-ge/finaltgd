import { createHash, createHmac } from 'node:crypto';

export interface DeviceSignals {
  hardwareId: string;
  osVersion: string;
  appInstallId: string;
  screenClass: string;
}

export function hashFingerprint(signals: DeviceSignals, salt: string): string {
  const canonical = [
    signals.hardwareId,
    signals.osVersion,
    signals.appInstallId,
    signals.screenClass,
  ].join('|');

  return createHmac('sha256', salt).update(canonical).digest('hex');
}

export function shortHash(value: string): string {
  return createHash('sha256').update(value).digest('hex').slice(0, 16);
}
