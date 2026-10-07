/**
 * End to end escrow creation and conditional release.
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

describe('escrow release', () => {
  it('creates escrow and refuses release without biometrics', async () => {
    const reference = `escrow-${Date.now()}`;

    const create = await post('/v1/wallet/escrow', {
      fromAccount: 1,
      toAccount: 2,
      amount: '1.0000',
      reference,
      idempotencyKey: `escrow-create-${Date.now()}`,
      releaseLat: -1.2921,
      releaseLon: 36.8219,
      releaseRadiusM: 50,
    });

    expect([200, 201]).toContain(create.status);
    const body = (await create.json()) as { escrowId: number };

    const release = await post('/v1/wallet/escrow/release', {
      escrowId: body.escrowId,
      releaseLat: -1.2921,
      releaseLon: 36.8219,
      biometricOk: false,
      idempotencyKey: `escrow-release-${Date.now()}`,
    });

    expect(release.status).toBeGreaterThanOrEqual(400);
  });

  it('refuses release outside the radius', async () => {
    const reference = `escrow-radius-${Date.now()}`;

    const create = await post('/v1/wallet/escrow', {
      fromAccount: 1,
      toAccount: 2,
      amount: '1.0000',
      reference,
      idempotencyKey: `escrow-create-${Date.now()}`,
      releaseLat: -1.2921,
      releaseLon: 36.8219,
      releaseRadiusM: 50,
    });

    expect([200, 201]).toContain(create.status);
    const body = (await create.json()) as { escrowId: number };

    const release = await post('/v1/wallet/escrow/release', {
      escrowId: body.escrowId,
      releaseLat: -1.4,
      releaseLon: 36.9,
      biometricOk: true,
      idempotencyKey: `escrow-release-${Date.now()}`,
    });

    expect(release.status).toBeGreaterThanOrEqual(400);
  });
});
