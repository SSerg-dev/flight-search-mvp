import assert from 'node:assert/strict';
import test from 'node:test';

import { searchFlightOffers } from '../src/services/flightService.js';
import { amadeusFlightOffersFixture } from './fixtures/amadeusFlightOffers.js';

const baseQuery = {
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

test('searchFlightOffers returns matching mock flight offers asynchronously', async () => {
  const searchPromise = searchFlightOffers(baseQuery);

  assert.equal(typeof searchPromise.then, 'function');

  const results = await searchPromise;

  assert.ok(results.length >= 2);
  assert.ok(results.every((flight) => flight.route.origin.city === baseQuery.from));
  assert.ok(results.every((flight) => flight.route.stopover.city === baseQuery.via));
  assert.ok(results.every((flight) => flight.route.destination.city === baseQuery.to));
});

test('searchFlightOffers simulates API timing without making network calls', async () => {
  const startedAt = Date.now();

  await searchFlightOffers(baseQuery, { delayMs: 5 });

  assert.ok(Date.now() - startedAt >= 5);
});

test('searchFlightOffers can simulate a service failure', async () => {
  await assert.rejects(
    searchFlightOffers(baseQuery, { shouldFail: true, delayMs: 0 }),
    {
      message: 'Mock flight service failed.',
    },
  );
});

test('searchFlightOffers uses mock adapter for mock mode', async () => {
  const results = await searchFlightOffers(baseQuery, {
    delayMs: 0,
    env: {
      VITE_FLIGHT_API_MODE: 'mock',
    },
  });

  assert.ok(results.length >= 2);
  assert.ok(results.every((flight) => flight.route.stopover.city === baseQuery.via));
});

test('searchFlightOffers falls back to mock adapter for unsupported mode', async () => {
  const results = await searchFlightOffers(baseQuery, {
    delayMs: 0,
    env: {
      VITE_FLIGHT_API_MODE: 'duffel',
    },
  });

  assert.ok(results.length >= 2);
  assert.ok(results.every((flight) => flight.route.origin.city === baseQuery.from));
});

test('searchFlightOffers fails safely when Amadeus mode has no proxy URL', async () => {
  await assert.rejects(
    searchFlightOffers(baseQuery, {
      delayMs: 0,
      env: {
        VITE_FLIGHT_API_MODE: 'amadeus',
      },
    }),
    {
      message: 'Flight API proxy URL is required for Amadeus mode.',
    },
  );
});

test('searchFlightOffers returns normalized Amadeus offers through configured proxy', async () => {
  const fetchImpl = async () => ({
    ok: true,
    json: async () => amadeusFlightOffersFixture,
  });

  const results = await searchFlightOffers(baseQuery, {
    fetchImpl,
    env: {
      VITE_FLIGHT_API_MODE: 'amadeus',
      VITE_FLIGHT_API_PROXY_URL: 'https://example.com/api/flights',
    },
  });

  assert.equal(results.length, 1);
  assert.equal(results[0].airline.name, 'Turkish Airlines');
  assert.equal(results[0].price.display, '$884');
  assert.equal(results[0].route.stopover.city, 'Istanbul');
});

test('searchFlightOffers maps malformed Amadeus proxy responses to a safe service error', async () => {
  const fetchImpl = async () => ({
    ok: true,
    json: async () => ({ data: [{ id: 'bad-offer' }] }),
  });

  await assert.rejects(
    searchFlightOffers(baseQuery, {
      fetchImpl,
      env: {
        VITE_FLIGHT_API_MODE: 'amadeus',
        VITE_FLIGHT_API_PROXY_URL: 'https://example.com/api/flights',
      },
    }),
    {
      message: 'Flight API response could not be normalized.',
    },
  );
});
