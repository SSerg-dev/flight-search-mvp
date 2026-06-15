import assert from 'node:assert/strict';
import test from 'node:test';

import serpapiProxyHandler, { createSerpApiProxyHandler } from '../api/serpapi-flights.js';
import { serpapiGoogleFlightsFixture } from './fixtures/serpapiGoogleFlights.js';

const proxyPayload = {
  provider: 'serpapi',
  route: {
    from: {
      query: 'Boston',
      iata: 'BOS',
    },
    via: {
      query: 'Istanbul',
      iata: 'IST',
    },
    to: {
      query: 'Saint Petersburg',
      iata: 'LED',
    },
  },
  departureDate: '2026-08-01',
  dateRange: {
    start: '2026-08-01',
    end: '2026-08-01',
  },
  adults: 2,
  layover: {
    minHours: 3,
    maxHours: 12,
  },
};

const env = {
  SERPAPI_API_KEY: 'server-serpapi-key',
};

test('SerpApi proxy rejects non-POST requests', async () => {
  const response = await createSerpApiProxyHandler({
    env,
    fetchImpl: async () => {
      throw new Error('fetch should not be called');
    },
  })({
    method: 'GET',
    body: '',
  });

  assert.equal(response.status, 405);
  assert.deepEqual(JSON.parse(response.body), {
    error: 'Method not allowed.',
  });
});

test('SerpApi proxy requires server-side credentials', async () => {
  const response = await createSerpApiProxyHandler({
    env: {},
    fetchImpl: async () => {
      throw new Error('fetch should not be called');
    },
  })({
    method: 'POST',
    body: JSON.stringify(proxyPayload),
  });

  assert.equal(response.status, 500);
  assert.deepEqual(JSON.parse(response.body), {
    error: 'Flight API proxy is not configured.',
  });
});

test('SerpApi proxy requests Google Flights one-way results', async () => {
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(String(url));

    return {
      ok: true,
      json: async () => serpapiGoogleFlightsFixture,
    };
  };

  const response = await createSerpApiProxyHandler({ env, fetchImpl })({
    method: 'POST',
    body: JSON.stringify(proxyPayload),
  });

  assert.equal(response.status, 200);
  assert.deepEqual(JSON.parse(response.body), serpapiGoogleFlightsFixture);

  const url = new URL(calls[0]);
  assert.equal(url.origin + url.pathname, 'https://serpapi.com/search');
  assert.equal(url.searchParams.get('engine'), 'google_flights');
  assert.equal(url.searchParams.get('type'), '2');
  assert.equal(url.searchParams.get('departure_id'), 'BOS');
  assert.equal(url.searchParams.get('arrival_id'), 'LED');
  assert.equal(url.searchParams.get('outbound_date'), '2026-08-01');
  assert.equal(url.searchParams.get('adults'), '2');
  assert.equal(url.searchParams.get('currency'), 'USD');
  assert.equal(url.searchParams.get('stops'), '2');
  assert.equal(url.searchParams.get('layover_duration'), '180,720');
  assert.equal(url.searchParams.get('api_key'), 'server-serpapi-key');
});

test('SerpApi proxy searches every date in the requested departure range', async () => {
  const calls = [];
  const fetchImpl = async (url) => {
    const searchUrl = new URL(url);
    const departureDate = searchUrl.searchParams.get('outbound_date');
    calls.push(departureDate);

    return {
      ok: true,
      json: async () => ({
        best_flights: [
          {
            date: departureDate,
            flights: [],
          },
        ],
        other_flights: [
          {
            date: `${departureDate}-other`,
            flights: [],
          },
        ],
      }),
    };
  };

  const response = await createSerpApiProxyHandler({ env, fetchImpl })({
    method: 'POST',
    body: JSON.stringify({
      ...proxyPayload,
      departureDate: '2026-08-01',
      dateRange: {
        start: '2026-08-01',
        end: '2026-08-10',
      },
    }),
  });

  assert.equal(response.status, 200);
  assert.deepEqual(calls, [
    '2026-08-01',
    '2026-08-02',
    '2026-08-03',
    '2026-08-04',
    '2026-08-05',
    '2026-08-06',
    '2026-08-07',
    '2026-08-08',
    '2026-08-09',
    '2026-08-10',
  ]);

  const body = JSON.parse(response.body);
  assert.equal(body.best_flights.length, 10);
  assert.equal(body.other_flights.length, 10);
  assert.equal(body.best_flights[0].date, '2026-08-01');
  assert.equal(body.best_flights[9].date, '2026-08-10');
});

test('SerpApi proxy maps rate limits safely', async () => {
  const response = await createSerpApiProxyHandler({
    env,
    fetchImpl: async () => ({
      ok: false,
      status: 429,
      json: async () => ({ error: 'rate limit' }),
    }),
  })({
    method: 'POST',
    body: JSON.stringify(proxyPayload),
  });

  assert.equal(response.status, 429);
  assert.deepEqual(JSON.parse(response.body), {
    error: 'Flight API rate limit reached. Please try again later.',
  });
});

test('SerpApi proxy validates request payload before calling SerpApi', async () => {
  const response = await createSerpApiProxyHandler({
    env,
    fetchImpl: async () => {
      throw new Error('fetch should not be called');
    },
  })({
    method: 'POST',
    body: JSON.stringify({
      ...proxyPayload,
      provider: 'duffel',
    }),
  });

  assert.equal(response.status, 400);
  assert.deepEqual(JSON.parse(response.body), {
    error: 'Flight API proxy request is invalid.',
  });
});

test('default SerpApi export writes JSON to a response object', async () => {
  const originalFetch = globalThis.fetch;
  const originalApiKey = process.env.SERPAPI_API_KEY;
  const statusCalls = [];
  const jsonCalls = [];

  process.env.SERPAPI_API_KEY = 'server-serpapi-key';
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => serpapiGoogleFlightsFixture,
  });

  try {
    await serpapiProxyHandler(
      {
        method: 'POST',
        body: proxyPayload,
      },
      {
        status(status) {
          statusCalls.push(status);
          return this;
        },
        json(body) {
          jsonCalls.push(body);
          return this;
        },
      },
    );
  } finally {
    globalThis.fetch = originalFetch;
    restoreEnvValue('SERPAPI_API_KEY', originalApiKey);
  }

  assert.deepEqual(statusCalls, [200]);
  assert.deepEqual(jsonCalls, [serpapiGoogleFlightsFixture]);
});

function restoreEnvValue(name, value) {
  if (value === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] = value;
}
