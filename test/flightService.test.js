import assert from 'node:assert/strict';
import test from 'node:test';

import { searchFlightOffers } from '../src/services/flightService.js';

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
