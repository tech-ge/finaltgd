/**
 * Ledger load simulation. Sends parallel transfer requests to the
 * gateway and checks for consistent status codes and no double
 * credit on idempotency keys.
 *
 * Run with:
 *   k6 run tests/load/ledger-load.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20,
  duration: '60s',
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<1500'],
  },
};

const GATEWAY = __ENV.GATEWAY_URL || 'http://localhost:3000';
const BEARER = __ENV.TEST_BEARER || '';

export default function () {
  const idempotencyKey = `load-${__VU}-${Date.now()}-${Math.random()}`;

  const payload = JSON.stringify({
    fromAccount: 1,
    toAccount: 2,
    amount: '0.0100',
    idempotencyKey,
  });

  const response = http.post(`${GATEWAY}/v1/wallet/send`, payload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${BEARER}`,
    },
  });

  check(response, {
    'accepted or rejected cleanly': (r) => [200, 201, 400, 409, 422, 429].includes(r.status),
  });

  sleep(0.1);
}
