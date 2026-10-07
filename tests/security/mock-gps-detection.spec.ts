/**
 * Mock GPS detection.
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

describe('mock gps detection', () => {
  it('flags impossible velocity between two samples', async () => {
    const now = Date.now();

    const response = await post('/v1/admin/fraud/mock-gps', {
      samples: [
        { lat: -1.2921, lon: 36.8219, at: new Date(now).toISOString() },
        { lat: 40.7128, lon: -74.006, at: new Date(now + 1000).toISOString() },
      ],
    });

    expect(response.status).toBe(200);
    const body = (await response.json()) as { flagged: boolean };
    expect(body.flagged).toBe(true);
  });

  it('does not flag realistic movement', async () => {
    const now = Date.now();

    const response = await post('/v1/admin/fraud/mock-gps', {
      samples: [
        { lat: -1.2921, lon: 36.8219, at: new Date(now).toISOString() },
        { lat: -1.2931, lon: 36.8221, at: new Date(now + 60_000).toISOString() },
      ],
    });

    expect(response.status).toBe(200);
    const body = (await response.json()) as { flagged: boolean };
    expect(body.flagged).toBe(false);
  });
});
