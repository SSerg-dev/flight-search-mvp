import assert from 'node:assert/strict';
import test from 'node:test';

import { mockFlights } from '../src/data/mockFlights.js';
import { searchFlights } from '../src/utils/searchFlights.js';

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

test('mock flights include realistic Boston to Saint Petersburg options through Istanbul', () => {
  assert.ok(mockFlights.length >= 3);

  const matchingRoute = mockFlights.filter(
    (flight) =>
      flight.from === 'Boston' &&
      flight.via === 'Istanbul' &&
      flight.to === 'Saint Petersburg' &&
      flight.currency === 'USD',
  );

  assert.ok(matchingRoute.length >= 3);
  assert.ok(matchingRoute.every((flight) => flight.price >= 500));
  assert.ok(matchingRoute.every((flight) => flight.segments.length === 2));
});

test('searchFlights matches route, date range, adults, and layover range', () => {
  const results = searchFlights(baseQuery, mockFlights);

  assert.ok(results.length >= 2);
  assert.ok(results.every((flight) => flight.from === baseQuery.from));
  assert.ok(results.every((flight) => flight.via === baseQuery.via));
  assert.ok(results.every((flight) => flight.to === baseQuery.to));
  assert.ok(results.every((flight) => flight.departureDate >= baseQuery.dateRange.start));
  assert.ok(results.every((flight) => flight.departureDate <= baseQuery.dateRange.end));
  assert.ok(results.every((flight) => flight.availableSeats >= baseQuery.adults));
  assert.ok(results.every((flight) => flight.layoverHours >= baseQuery.minLayover));
  assert.ok(results.every((flight) => flight.layoverHours <= baseQuery.maxLayover));
});

test('searchFlights returns an empty list when no mock flights match', () => {
  const results = searchFlights(
    {
      ...baseQuery,
      minLayover: 13,
      maxLayover: 18,
    },
    mockFlights,
  );

  assert.deepEqual(results, []);
});
