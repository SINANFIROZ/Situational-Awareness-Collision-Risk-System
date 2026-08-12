import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../backend/src/app.js';

async function withServer(run) {
  const app = createApp();

  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));

  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    await run(baseUrl);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }
}

test('GET /api/v1/health returns ok', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/health`);
    assert.equal(response.status, 200);

    const data = await response.json();
    assert.deepEqual(data, { status: 'ok' });
  });
});

test('POST /api/v1/risk/evaluate returns risk result', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/risk/evaluate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        ownShip: { x: 0, y: 0, velocity: { vx: 0, vy: 0 } },
        target: { x: 100, y: 0, velocity: { vx: -10, vy: 0 } },
      }),
    });

    assert.equal(response.status, 200);

    const data = await response.json();
    assert.equal(data.tcpa, 10);
    assert.equal(data.cpa, 0);
    assert.equal(data.risk, 'DANGER');
  });
});

test('POST /api/v1/risk/evaluate returns 400 for invalid body', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/risk/evaluate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    });

    assert.equal(response.status, 400);

    const data = await response.json();
    assert.equal(data.error, 'INVALID_INPUT');
  });
});
