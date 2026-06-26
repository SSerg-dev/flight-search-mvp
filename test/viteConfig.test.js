import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import test from 'node:test';

import { createFlightSearchViteConfig } from '../vite.config.js';

test('Vite dev middleware uses server-only SerpApi env from loaded env files', async () => {
  const config = createFlightSearchViteConfig({
    env: {
      SERPAPI_API_KEY: 'server-serpapi-key',
      SERPAPI_API_BASE_URL: 'https://serpapi.test',
    },
    fetchImpl: async (url) => ({
      ok: true,
      json: async () => ({
        searchUrl: url,
      }),
    }),
  });
  const serpApiPlugin = config.plugins.find((plugin) => plugin.name === 'flight-search-serpapi-api-dev');
  const middlewareCalls = [];

  serpApiPlugin.configureServer({
    middlewares: {
      use(middleware) {
        middlewareCalls.push(middleware);
      },
    },
  });

  const request = createRequest({
    method: 'POST',
    url: '/api/serpapi-flights',
    body: JSON.stringify({
      provider: 'serpapi',
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
    throw new Error('next should not be called for SerpApi requests');
  });

  assert.equal(response.status, 200);

  const searchUrl = new URL(JSON.parse(response.body).searchUrl);
  assert.equal(searchUrl.origin, 'https://serpapi.test');
  assert.equal(searchUrl.searchParams.get('api_key'), 'server-serpapi-key');
});

test('Vite config registers only SerpApi API middleware', () => {
  const config = createFlightSearchViteConfig();
  const apiPlugins = config.plugins.filter((plugin) => String(plugin.name).includes('flight-search-'));

  assert.deepEqual(
    apiPlugins.map((plugin) => plugin.name),
    ['flight-search-serpapi-api-dev'],
  );
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
