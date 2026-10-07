/**
 * Authentication boundary checks.
 */

import { describe, expect, it } from 'vitest';

const GATEWAY = process.env.GATEWAY_URL ?? 'http://localhost:3000';

describe('auth penetration', () => {
  it('rejects a request without a bearer token', async () => {
    const response = await fetch(`${GATEWAY}/v1/wallet/balance/1`);
    expect([401, 403]).toContain(response.status);
  });

  it('rejects a tampered bearer token', async () => {
    const response = await fetch(`${GATEWAY}/v1/wallet/balance/1`, {
      headers: { Authorization: 'Bearer not.a.real.token' },
    });
    expect([401, 403]).toContain(response.status);
  });

  it('rejects a request without a device fingerprint', async () => {
    const response = await fetch(`${GATEWAY}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accountId: 1,
        role: 'USER',
        hardware: '',
        osVersion: '',
        installId: '',
        screenClass: '',
      }),
    });
    expect([400, 422]).toContain(response.status);
  });
});
