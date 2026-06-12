import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import test from 'node:test';

import { createFlightSearchViteConfig } from '../vite.config.js';

test('Vite dev middleware uses server-only Duffel env from loaded env files', async () => {
  const config = createFlightSearchViteConfig({
    env: {
      DUFFEL_ACCESS_TOKEN: 'server-duffel-token',
      DUFFEL_API_BASE_URL: 'https://duffel.test',
    },
    fetchImpl: async (url, init) => ({
      ok: true,
      json: async () => ({
        data: {
          url,
          authorization: init.headers.Authorization,
        },
      }),
    }),
  });
  const duffelPlugin = config.plugins.find((plugin) => plugin.name === 'flight-search-duffel-api-dev');
  const middlewareCalls = [];

  duffelPlugin.configureServer({
    middlewares: {
      use(middleware) {
        middlewareCalls.push(middleware);
      },
    },
  });

  const request = createRequest({
    method: 'POST',
    url: '/api/duffel-flights',
    body: JSON.stringify({
      provider: 'duffel',
      route: {
        from: { iata: 'BOS' },
        via: { iata: 'IST' },
        to: { iata: 'LED' },
      },
      departureDate: '2026-08-01',
      adults: 1,
    }),
  });
  const response = createResponse();

  await middlewareCalls[0](request, response, () => {
    throw new Error('next should not be called for Duffel API requests');
  });

  assert.equal(response.status, 200);
  assert.equal(JSON.parse(response.body).data.authorization, 'Bearer server-duffel-token');
});

function createRequest({ method, url, body }) {
  const request = new EventEmitter();
  request.method = method;
  request.url = url;

  queueMicrotask(() => {
    request.emit('data', Buffer.from(body));
    request.emit('end');
  });

  return request;
}

function createResponse() {
  return {
    body: '',
    headers: {},
    status: 200,
    setHeader(name, value) {
      this.headers[name] = value;
    },
    end(body) {
      this.body = body;
    },
    set statusCode(value) {
      this.status = value;
    },
  };
}
