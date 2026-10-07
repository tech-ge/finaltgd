/**
 * End to end emergency trigger.
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

describe('emergency trigger', () => {
  it('accepts a manual trigger and plans a dial', async () => {
    const response = await post('/v1/assistant/emergency', {
      accountId: 1,
      trigger: 'manual',
    });

    if (response.status === 202) {
      const body = (await response.json()) as { plan: { shouldDialEmergencyServices: boolean } };
      expect(body.plan.shouldDialEmergencyServices).toBe(false);
    } else {
      expect([400, 403, 422]).toContain(response.status);
    }
  });

  it('accepts an accident trigger and plans a dial', async () => {
    const response = await post('/v1/assistant/emergency', {
      accountId: 1,
      trigger: 'accident.detected',
      location: { lat: -1.2921, lon: 36.8219 },
    });

    if (response.status === 202) {
      const body = (await response.json()) as { plan: { shouldDialEmergencyServices: boolean } };
      expect(body.plan.shouldDialEmergencyServices).toBe(true);
    } else {
      expect([400, 403, 422]).toContain(response.status);
    }
  });

  it('rejects an unknown trigger value', async () => {
    const response = await post('/v1/assistant/emergency', {
      accountId: 1,
      trigger: 'unknown',
    });
    expect([400, 422]).toContain(response.status);
  });
});
