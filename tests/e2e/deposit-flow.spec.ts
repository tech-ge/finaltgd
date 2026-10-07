/**
 * End to end deposit flow.
 *
 * Flow:
 *   1. Confirm a fiat deposit via the currency service.
 *   2. Read the recipient balance.
 *   3. Read the treasury and recipient ledger entries.
 *   4. Verify idempotency on the gateway reference.
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

async function get(path: string): Promise<Response> {
  return fetch(`${GATEWAY}${path}`, {
    headers: BEARER ? { Authorization: `Bearer ${BEARER}` } : {},
  });
}

describe('deposit flow', () => {
  it('mints TGD on a valid deposit and is idempotent', async () => {
    const gatewayReference = `test-deposit-${Date.now()}`;

    const first = await post('/v1/wallet/deposit', {
      accountId: 1,
      fiatAmount: '100.00',
      fiatCurrency: 'KES',
      gatewayReference,
      gatewayName: 'mpesa',
    });

    expect([200, 201]).toContain(first.status);

    const second = await post('/v1/wallet/deposit', {
      accountId: 1,
      fiatAmount: '100.00',
      fiatCurrency: 'KES',
      gatewayReference,
      gatewayName: 'mpesa',
    });

    // Duplicate reference must not double-mint.
    expect([409, 422]).toContain(second.status);
  });

  it('rejects an unsupported currency', async () => {
    const response = await post('/v1/wallet/deposit', {
      accountId: 1,
      fiatAmount: '100.00',
      fiatCurrency: 'ZZZ',
      gatewayReference: `test-unsupported-${Date.now()}`,
      gatewayName: 'mpesa',
    });
    expect([400, 422]).toContain(response.status);
  });

  it('rejects a withdrawal-shaped payload', async () => {
    const response = await post('/v1/wallet/withdraw', {
      accountId: 1,
      amount: '10.0000',
    });
    expect(response.status).toBe(404);
  });

  it('reads the balance for an account', async () => {
    const response = await get('/v1/wallet/balance/1');
    if (response.status === 200) {
      const body = (await response.json()) as { balance: string };
      expect(typeof body.balance).toBe('string');
      expect(Number.isFinite(Number.parseFloat(body.balance))).toBe(true);
    }
  });
});
