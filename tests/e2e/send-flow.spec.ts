/**
 * End to end internal transfer.
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

describe('send flow', () => {
  it('completes an internal transfer and is idempotent', async () => {
    const idempotencyKey = `test-send-${Date.now()}`;

    const payload = {
      fromAccount: 1,
      toAccount: 2,
      amount: '0.1000',
      idempotencyKey,
    };

    const first = await post('/v1/wallet/send', payload);
    expect([200, 201]).toContain(first.status);

    const second = await post('/v1/wallet/send', payload);
    // Same idempotency key returns the same transfer, not a new one.
    expect([200, 201, 409]).toContain(second.status);
  });

  it('rejects a transfer to the same account', async () => {
    const response = await post('/v1/wallet/send', {
      fromAccount: 1,
      toAccount: 1,
      amount: '0.1000',
      idempotencyKey: `test-self-${Date.now()}`,
    });
    expect([400, 422]).toContain(response.status);
  });

  it('rejects a zero amount', async () => {
    const response = await post('/v1/wallet/send', {
      fromAccount: 1,
      toAccount: 2,
      amount: '0.0000',
      idempotencyKey: `test-zero-${Date.now()}`,
    });
    expect([400, 422]).toContain(response.status);
  });
});
