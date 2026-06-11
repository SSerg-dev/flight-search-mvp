import assert from 'node:assert/strict';
import test from 'node:test';

import duffelProxyHandler, { createDuffelProxyHandler } from '../api/duffel-flights.js';
import { duffelOfferRequestFixture } from './fixtures/duffelOfferRequest.js';

const proxyPayload = {
  provider: 'duffel',
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
    end: '2026-08-10',
  },
  adults: 2,
  layover: {
    minHours: 3,
    maxHours: 12,
  },
};

const env = {
  DUFFEL_ACCESS_TOKEN: 'server-duffel-token',
};

test('Duffel serverless proxy rejects non-POST requests', async () => {
  const response = await createDuffelProxyHandler({
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

test('Duffel serverless proxy requires server-side credentials', async () => {
  const response = await createDuffelProxyHandler({
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

test('Duffel serverless proxy creates an offer request with mandatory stopover slices', async () => {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });

    if (url === 'https://api.duffel.com/air/offer_requests?return_offers=true') {
      return {
        ok: true,
        json: async () => duffelOfferRequestFixture,
      };
    }

    throw new Error(`Unexpected URL: ${url}`);
  };

  const response = await createDuffelProxyHandler({ env, fetchImpl })({
    method: 'POST',
    body: JSON.stringify(proxyPayload),
  });

  assert.equal(response.status, 200);
  assert.deepEqual(JSON.parse(response.body), duffelOfferRequestFixture);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].init.method, 'POST');
  assert.equal(calls[0].init.headers.Authorization, 'Bearer server-duffel-token');
  assert.equal(calls[0].init.headers['Content-Type'], 'application/json');
  assert.equal(calls[0].init.headers['Duffel-Version'], 'v2');

  assert.deepEqual(JSON.parse(calls[0].init.body), {
    data: {
      slices: [
        {
          origin: 'BOS',
          destination: 'IST',
          departure_date: '2026-08-01',
        },
        {
          origin: 'IST',
          destination: 'LED',
          departure_date: '2026-08-01',
        },
      ],
      passengers: [
        {
          type: 'adult',
        },
        {
          type: 'adult',
        },
      ],
      cabin_class: 'economy',
    },
  });
});

test('Duffel serverless proxy validates request payload before calling Duffel', async () => {
  const response = await createDuffelProxyHandler({
    env,
    fetchImpl: async () => {
      throw new Error('fetch should not be called');
    },
  })({
    method: 'POST',
    body: JSON.stringify({
      ...proxyPayload,
      route: {
        ...proxyPayload.route,
        via: {
          query: 'Missing',
          iata: '',
        },
      },
    }),
  });

  assert.equal(response.status, 400);
  assert.deepEqual(JSON.parse(response.body), {
    error: 'Flight API proxy request is invalid.',
  });
});

test('Duffel serverless proxy maps authorization failures safely', async () => {
  const response = await createDuffelProxyHandler({
    env,
    fetchImpl: async () => ({
      ok: false,
      status: 401,
      json: async () => ({ errors: [] }),
    }),
  })({
    method: 'POST',
    body: JSON.stringify(proxyPayload),
  });

  assert.equal(response.status, 401);
  assert.deepEqual(JSON.parse(response.body), {
    error: 'Flight API authorization failed.',
  });
});

test('Duffel serverless proxy maps rate limits safely', async () => {
  const response = await createDuffelProxyHandler({
    env,
    fetchImpl: async () => ({
      ok: false,
      status: 429,
      json: async () => ({ errors: [] }),
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

test('default Duffel serverless export writes JSON to a response object', async () => {
  const originalFetch = globalThis.fetch;
  const originalToken = process.env.DUFFEL_ACCESS_TOKEN;
  const statusCalls = [];
  const jsonCalls = [];

  process.env.DUFFEL_ACCESS_TOKEN = 'server-duffel-token';
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => duffelOfferRequestFixture,
  });

  try {
    await duffelProxyHandler(
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
    restoreEnvValue('DUFFEL_ACCESS_TOKEN', originalToken);
  }

  assert.deepEqual(statusCalls, [200]);
  assert.deepEqual(jsonCalls, [duffelOfferRequestFixture]);
});

function restoreEnvValue(name, value) {
  if (value === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] = value;
}
