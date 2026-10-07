/**
 * End to end voice enrollment and synthesis.
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

describe('voice enrollment', () => {
  it('rejects a sample shorter than 1500ms', async () => {
    const response = await post('/v1/assistant/enroll-voice', {
      accountId: 1,
      sampleRateHz: 16000,
      durationMs: 800,
      pcmBase64: Buffer.alloc(64).toString('base64'),
    });

    expect([400, 422]).toContain(response.status);
  });

  it('rejects a sample with an empty payload', async () => {
    const response = await post('/v1/assistant/enroll-voice', {
      accountId: 1,
      sampleRateHz: 16000,
      durationMs: 2000,
      pcmBase64: '',
    });

    expect([400, 422]).toContain(response.status);
  });

  it('refuses synthesis for an unenrolled account', async () => {
    const response = await post('/v1/assistant/synthesize', {
      accountId: 9999,
      text: 'Hello from TechGeo.',
    });

    expect([404, 422]).toContain(response.status);
  });
});
