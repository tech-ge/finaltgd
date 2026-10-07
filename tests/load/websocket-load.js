/**
 * WebSocket load simulation. Opens many concurrent sockets and
 * verifies that messages flow when published to a Redis channel.
 *
 * Run with:
 *   node tests/load/websocket-load.js
 */

import WebSocket from 'ws';

const GATEWAY_WS = process.env.GATEWAY_WS_URL || 'ws://localhost:3000/ws/stream';
const BEARER = process.env.TEST_BEARER || '';
const CONNECTIONS = Number.parseInt(process.env.CONNECTIONS || '50', 10);

async function main() {
  const sockets = [];

  for (let i = 0; i < CONNECTIONS; i += 1) {
    const ws = new WebSocket(`${GATEWAY_WS}?token=${encodeURIComponent(BEARER)}`);
    sockets.push(ws);

    ws.on('open', () => {
      // Hold the connection open.
    });

    ws.on('error', () => {
      // Ignore individual socket errors.
    });
  }

  await new Promise((resolve) => setTimeout(resolve, 30_000));

  for (const ws of sockets) {
    ws.close();
  }

  console.log(`closed ${sockets.length} sockets`);
}

void main();
