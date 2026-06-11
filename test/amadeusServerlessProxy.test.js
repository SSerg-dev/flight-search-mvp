import assert from 'node:assert/strict';
import test from 'node:test';

import { amadeusFlightOffersFixture } from './fixtures/amadeusFlightOffers.js';
import amadeusProxyHandler, { createAmadeusProxyHandler } from '../api/flights.js';

const proxyPayload = {
  provider: 'amadeus',
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
  AMADEUS_CLIENT_ID: 'server-client-id',
  AMADEUS_CLIENT_SECRET: 'server-client-secret',
};

test('serverless proxy rejects non-POST requests', async () => {
  const response = await createAmadeusProxyHandler({
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

test('serverless proxy requires server-side Amadeus credentials', async () => {
  const response = await createAmadeusProxyHandler({
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

test('serverless proxy requests token and flight offers from Amadeus', async () => {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });

    if (url === 'https://test.api.amadeus.com/v1/security/oauth2/token') {
      return {
        ok: true,
        json: async () => ({
          token_type: 'Bearer',
          access_token: 'token-from-amadeus',
          expires_in: 1799,
        }),
      };
    }

    if (url === 'https://test.api.amadeus.com/v2/shopping/flight-offers') {
      return {
        ok: true,
        json: async () => amadeusFlightOffersFixture,
      };
    }

    throw new Error(`Unexpected URL: ${url}`);
  };

  const response = await createAmadeusProxyHandler({ env, fetchImpl })({
    method: 'POST',
    body: JSON.stringify(proxyPayload),
  });

  assert.equal(response.status, 200);
  assert.deepEqual(JSON.parse(response.body), amadeusFlightOffersFixture);
  assert.equal(calls.length, 2);

  assert.equal(calls[0].init.method, 'POST');
  assert.equal(calls[0].init.headers['Content-Type'], 'application/x-www-form-urlencoded');
  assert.equal(calls[0].init.body, 'grant_type=client_credentials&client_id=server-client-id&client_secret=server-client-secret');

  assert.equal(calls[1].init.method, 'POST');
  assert.equal(calls[1].init.headers.Authorization, 'Bearer token-from-amadeus');
  assert.equal(calls[1].init.headers['Content-Type'], 'application/vnd.amadeus+json');

  const flightOffersBody = JSON.parse(calls[1].init.body);
  assert.deepEqual(flightOffersBody, {
    currencyCode: 'USD',
    originDestinations: [
      {
        id: '1',
        originLocationCode: 'BOS',
        destinationLocationCode: 'LED',
        departureDateTimeRange: {
          date: '2026-08-01',
        },
        includedConnectionPoints: ['IST'],
      },
    ],
    travelers: [
      {
        id: '1',
        travelerType: 'ADULT',
      },
      {
        id: '2',
        travelerType: 'ADULT',
      },
    ],
    sources: ['GDS'],
    searchCriteria: {
      maxFlightOffers: 20,
    },
  });
});

test('serverless proxy maps Amadeus authorization failures safely', async () => {
  const response = await createAmadeusProxyHandler({
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

test('serverless proxy maps Amadeus rate limits safely', async () => {
  const fetchImpl = async (url) => {
    if (url.endsWith('/v1/security/oauth2/token')) {
      return {
        ok: true,
        json: async () => ({
          access_token: 'token-from-amadeus',
        }),
      };
    }

    return {
      ok: false,
      status: 429,
      json: async () => ({ errors: [] }),
    };
  };

  const response = await createAmadeusProxyHandler({ env, fetchImpl })({
    method: 'POST',
    body: JSON.stringify(proxyPayload),
  });

  assert.equal(response.status, 429);
  assert.deepEqual(JSON.parse(response.body), {
    error: 'Flight API rate limit reached. Please try again later.',
  });
});

test('serverless proxy validates request payload before calling Amadeus', async () => {
  const response = await createAmadeusProxyHandler({
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
        to: {
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

test('default serverless export writes JSON to a response object', async () => {
  const originalFetch = globalThis.fetch;
  const originalClientId = process.env.AMADEUS_CLIENT_ID;
  const originalClientSecret = process.env.AMADEUS_CLIENT_SECRET;
  const statusCalls = [];
  const jsonCalls = [];

  process.env.AMADEUS_CLIENT_ID = 'server-client-id';
  process.env.AMADEUS_CLIENT_SECRET = 'server-client-secret';
  globalThis.fetch = async (url) => {
    if (url.endsWith('/v1/security/oauth2/token')) {
      return {
        ok: true,
        json: async () => ({
          access_token: 'token-from-amadeus',
        }),
      };
    }

    return {
      ok: true,
      json: async () => amadeusFlightOffersFixture,
    };
  };

  try {
    await amadeusProxyHandler(
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
    restoreEnvValue('AMADEUS_CLIENT_ID', originalClientId);
    restoreEnvValue('AMADEUS_CLIENT_SECRET', originalClientSecret);
  }

  assert.deepEqual(statusCalls, [200]);
  assert.deepEqual(jsonCalls, [amadeusFlightOffersFixture]);
});

function restoreEnvValue(name, value) {
  if (value === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] = value;
}
