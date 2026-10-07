/**
 * Device binding boundary checks.
 */

import { describe, expect, it } from 'vitest';

const GATEWAY = process.env.GATEWAY_URL ?? 'http://localhost:3000';
const BEARER = process.env.TEST_BEARER ?? '';

async function post(path: string, body: unknown): Promise<Response> {
  return fetch(`${GATEWAY}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(BEARER ? { Authorization: `Bearer ${BEARER}` } : {}),
    },
    body: JSON.stringify(body),
  });
}

describe('device binding bypass', () => {
  it('refuses a second binding for the same account', async () => {
    const payload = {
      accountId: 1,
      hardwareId: 'test-hardware',
      osVersion: 'test-os',
      appInstallId: 'test-install',
      screenClass: 'test-screen',
    };

    const first = await post('/v1/identity/device/bind', payload);
    const second = await post('/v1/identity/device/bind', payload);

    // Second attempt with the same fingerprint must not create a new binding.
    expect([200, 201, 409, 422]).toContain(first.status);
    expect([409, 422]).toContain(second.status);
  });

  it('refuses a binding with an empty fingerprint part', async () => {
    const response = await post('/v1/identity/device/bind', {
      accountId: 1,
      hardwareId: '',
      osVersion: '',
      appInstallId: '',
      screenClass: '',
    });
    expect([400, 422]).toContain(response.status);
  });
});
