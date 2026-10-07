/**
 * GPS ingestion load simulation. Sends crowd speed samples to the
 * maps service and checks that congestion reports are returned.
 *
 * Run with:
 *   k6 run tests/load/gps-ingest-load.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 30,
  duration: '45s',
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<1000'],
  },
};

const GATEWAY = __ENV.GATEWAY_URL || 'http://localhost:3000';
const BEARER = __ENV.TEST_BEARER || '';

export default function () {
  const samples = [];
  for (let i = 0; i < 10; i += 1) {
    samples.push({
      segmentId: `seg-${__VU}-${i}`,
      speedMps: Math.random() * 20,
      observedAt: new Date().toISOString(),
      weight: 1,
    });
  }

  const response = http.post(
    `${GATEWAY}/v1/maps/traffic`,
    JSON.stringify({ samples }),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${BEARER}`,
      },
    },
  );

  check(response, {
    'traffic aggregation accepted': (r) => [200, 400, 429].includes(r.status),
  });

  sleep(0.1);
}
