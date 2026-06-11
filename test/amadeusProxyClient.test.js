import assert from 'node:assert/strict';
import test from 'node:test';

import { buildAmadeusProxyRequest, fetchAmadeusFlightOffers } from '../src/services/proxy/amadeusProxyClient.js';
import { amadeusFlightOffersFixture } from './fixtures/amadeusFlightOffers.js';

const query = {
  from: 'Boston',
  via: 'Istanbul',
  to: 'Saint Petersburg',
  departureDate: '2026-08-01',
  dateRange: {
    start: '2026-08-01',
    end: '2026-08-10',
  },
  adults: 2,
  minLayover: 3,
  maxLayover: 12,
};

test('buildAmadeusProxyRequest maps search query without provider secrets', () => {
  assert.deepEqual(buildAmadeusProxyRequest(query), {
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
  });
});

test('fetchAmadeusFlightOffers posts search payload to configured proxy', async () => {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });

    return {
      ok: true,
      json: async () => amadeusFlightOffersFixture,
    };
  };

  const response = await fetchAmadeusFlightOffers(query, {
    proxyUrl: 'https://example.com/api/flights',
    fetchImpl,
  });

  assert.equal(response, amadeusFlightOffersFixture);
  assert.equal(calls[0].url, 'https://example.com/api/flights');
  assert.equal(calls[0].init.method, 'POST');
  assert.equal(calls[0].init.headers['Content-Type'], 'application/json');
  assert.deepEqual(JSON.parse(calls[0].init.body), buildAmadeusProxyRequest(query));
});

test('buildAmadeusProxyRequest fails safely when a route airport cannot be resolved', () => {
  assert.throws(
    () => buildAmadeusProxyRequest({
      ...query,
      from: 'Unknown City',
    }),
    {
      message: 'Airport could not be resolved for From.',
    },
  );
});

test('fetchAmadeusFlightOffers does not call proxy when route airport mapping fails', async () => {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });

    return {
      ok: true,
      json: async () => amadeusFlightOffersFixture,
    };
  };

  await assert.rejects(
    fetchAmadeusFlightOffers(
      {
        ...query,
        to: 'Unknown City',
      },
      {
        proxyUrl: 'https://example.com/api/flights',
        fetchImpl,
      },
    ),
    {
      message: 'Airport could not be resolved for To.',
    },
  );

  assert.deepEqual(calls, []);
});

test('fetchAmadeusFlightOffers requires a proxy URL', async () => {
  await assert.rejects(fetchAmadeusFlightOffers(query, { proxyUrl: '' }), {
    message: 'Flight API proxy URL is required for Amadeus mode.',
  });
});

test('fetchAmadeusFlightOffers maps authorization failures safely', async () => {
  const fetchImpl = async () => ({
    ok: false,
    status: 401,
    json: async () => ({}),
  });

  await assert.rejects(
    fetchAmadeusFlightOffers(query, {
      proxyUrl: 'https://example.com/api/flights',
      fetchImpl,
    }),
    {
      message: 'Flight API authorization failed.',
    },
  );
});

test('fetchAmadeusFlightOffers maps rate limits safely', async () => {
  const fetchImpl = async () => ({
    ok: false,
    status: 429,
    json: async () => ({}),
  });

  await assert.rejects(
    fetchAmadeusFlightOffers(query, {
      proxyUrl: 'https://example.com/api/flights',
      fetchImpl,
    }),
    {
      message: 'Flight API rate limit reached. Please try again later.',
    },
  );
});

test('fetchAmadeusFlightOffers maps network failures safely', async () => {
  const fetchImpl = async () => {
    throw new Error('low-level network failure');
  };

  await assert.rejects(
    fetchAmadeusFlightOffers(query, {
      proxyUrl: 'https://example.com/api/flights',
      fetchImpl,
    }),
    {
      message: 'Flight API network request failed.',
    },
  );
});
