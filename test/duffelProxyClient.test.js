import assert from 'node:assert/strict';
import test from 'node:test';

import { buildDuffelProxyRequest, fetchDuffelFlightOffers } from '../src/services/proxy/duffelProxyClient.js';
import { duffelOfferRequestFixture } from './fixtures/duffelOfferRequest.js';

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

test('buildDuffelProxyRequest maps search query without provider secrets', () => {
  assert.deepEqual(buildDuffelProxyRequest(query), {
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
  });
});

test('fetchDuffelFlightOffers posts search payload to configured proxy', async () => {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });

    return {
      ok: true,
      json: async () => duffelOfferRequestFixture,
    };
  };

  const response = await fetchDuffelFlightOffers(query, {
    proxyUrl: 'https://example.com/api/duffel-flights',
    fetchImpl,
  });

  assert.equal(response, duffelOfferRequestFixture);
  assert.equal(calls[0].url, 'https://example.com/api/duffel-flights');
  assert.equal(calls[0].init.method, 'POST');
  assert.equal(calls[0].init.headers['Content-Type'], 'application/json');
  assert.deepEqual(JSON.parse(calls[0].init.body), buildDuffelProxyRequest(query));
});

test('buildDuffelProxyRequest fails safely when a route airport cannot be resolved', () => {
  assert.throws(
    () => buildDuffelProxyRequest({
      ...query,
      via: 'Unknown City',
    }),
    {
      message: 'Airport could not be resolved for Via.',
    },
  );
});
