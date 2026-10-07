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

export function validateSignals(signals: DeviceSignals): void {
  if (signals.hardwareId.trim().length === 0) {
    throw new Error('hardware_id_required');
  }
  if (signals.osVersion.trim().length === 0) {
    throw new Error('os_version_required');
  }
  if (signals.appInstallId.trim().length === 0) {
    throw new Error('app_install_id_required');
  }
  if (signals.screenClass.trim().length === 0) {
    throw new Error('screen_class_required');
  }
}
