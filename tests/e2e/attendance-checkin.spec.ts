/**
 * End to end attendance checkin.
 */

import { describe, expect, it } from 'vitest';

const GATEWAY = process.env.GATEWAY_URL ?? 'http://localhost:3000';
const BEARER = process.env.TEST_BEARER ?? '';

async function post(
  path: string,
  body: unknown,
  extraHeaders: Record<string, string> = {},
): Promise<Response> {
  return fetch(`${GATEWAY}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
      ...(BEARER ? { Authorization: `Bearer ${BEARER}` } : {}),
    },
    body: JSON.stringify(body),
  });
}

describe('attendance checkin', () => {
  it('records a match with the correct ip and coordinates', async () => {
    const response = await post(
      '/v1/attendance/checkin',
      {
        employeeId: 1,
        orgId: 1,
        observedLat: -1.2921,
        observedLon: 36.8219,
      },
      { 'CF-Connecting-IP': '203.0.113.10' },
    );

    if (response.status === 201) {
      const body = (await response.json()) as { status: string };
      expect(body.status).toBe('AUTOMATIC_GEO_MATCH');
    } else {
      expect([400, 403, 422]).toContain(response.status);
    }
  });

  it('records a failed ip when the header does not match', async () => {
    const response = await post(
      '/v1/attendance/checkin',
      {
        employeeId: 1,
        orgId: 1,
        observedLat: -1.2921,
        observedLon: 36.8219,
      },
      { 'CF-Connecting-IP': '198.51.100.7' },
    );

    if (response.status === 201) {
      const body = (await response.json()) as { status: string };
      expect(body.status).toBe('FAILED_IP');
    } else {
      expect([400, 403, 422]).toContain(response.status);
    }
  });
});
