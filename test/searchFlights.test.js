import assert from 'node:assert/strict';
import test from 'node:test';

import { mockFlights } from '../src/data/mockFlights.js';
import { searchFlights } from '../src/utils/searchFlights.js';

const baseQuery = {
  from: 'Boston',
  via: 'Istanbul',
  to: 'Saint Petersburg',
  departureDate: '2026-10-01',
  dateRange: {
    start: '2026-10-01',
    end: '2026-10-10',
  },
  adults: 2,
  minLayover: 3,
  maxLayover: 12,
};

const currentDate = new Date('2026-09-04T12:00:00');

test('mock flights include realistic Boston to Saint Petersburg options through Istanbul', () => {
  assert.ok(mockFlights.length >= 3);

  const matchingRoute = mockFlights.filter(
    (flight) =>
      flight.route.origin.city === 'Boston' &&
      flight.route.stopover.city === 'Istanbul' &&
      flight.route.destination.city === 'Saint Petersburg' &&
      flight.price.currency === 'USD',
  );

  assert.ok(matchingRoute.length >= 3);
  assert.ok(matchingRoute.every((flight) => flight.price.amount >= 500));
  assert.ok(matchingRoute.every((flight) => flight.segments.length === 2));
});

test('mock flights expose an API-like nested data model', () => {
  const flight = mockFlights[0];

  assert.equal(typeof flight.id, 'string');
  assert.deepEqual(Object.keys(flight.airline), ['name', 'code', 'flightNumbers']);
  assert.deepEqual(Object.keys(flight.price), ['amount', 'currency', 'display', 'passengerCount']);
  assert.deepEqual(Object.keys(flight.route), ['origin', 'stopover', 'destination', 'departureDate']);
  assert.deepEqual(Object.keys(flight.duration), [
    'totalMinutes',
    'display',
    'layoverMinutes',
    'layoverDisplay',
  ]);
  assert.deepEqual(Object.keys(flight.availability), ['seats', 'canBookAdults']);
  assert.equal(flight.segments.length, 2);
  assert.ok(flight.segments.every((segment) => segment.flightNumber));
});

test('searchFlights matches route, date range, adults, and layover range', () => {
  const results = searchFlights(baseQuery, mockFlights, { currentDate });

  assert.ok(results.length >= 2);
  assert.ok(results.every((flight) => flight.route.origin.city === baseQuery.from));
  assert.ok(results.every((flight) => flight.route.stopover.city === baseQuery.via));
  assert.ok(results.every((flight) => flight.route.destination.city === baseQuery.to));
  assert.ok(results.every((flight) => flight.route.departureDate >= baseQuery.dateRange.start));
  assert.ok(results.every((flight) => flight.route.departureDate <= baseQuery.dateRange.end));
  assert.ok(results.every((flight) => flight.availability.seats >= baseQuery.adults));
  assert.ok(results.every((flight) => flight.duration.layoverMinutes >= baseQuery.minLayover * 60));
  assert.ok(results.every((flight) => flight.duration.layoverMinutes <= baseQuery.maxLayover * 60));
});

test('searchFlights returns an empty list when no mock flights match', () => {
  const results = searchFlights(
    {
      ...baseQuery,
      minLayover: 13,
      maxLayover: 18,
    },
    mockFlights,
    { currentDate },
  );

  assert.deepEqual(results, []);
});

test('searchFlights filters out flights with invalid arrival timing', () => {
  const invalidFlight = {
    ...mockFlights[0],
    id: 'invalid-arrival-before-departure',
    segments: [
      {
        ...mockFlights[0].segments[0],
        departure: '2026-10-01 21:35',
        arrival: '2026-10-01 20:25',
      },
    ],
  };

  const results = searchFlights(baseQuery, [invalidFlight], { currentDate });

  assert.deepEqual(results, []);
});

test('searchFlights matches any airport contained in a city-wide endpoint', () => {
  const flight = structuredClone(mockFlights[0]);
  flight.route.destination = {
    city: 'Moscow',
    airport: 'Vnukovo International Airport',
    code: 'VKO',
  };

  const results = searchFlights(
    {
      ...baseQuery,
      connectionPreference: 'all',
      via: '',
      viaAirportId: '',
      to: 'Moscow',
      toAirportId: 'city:ru:moscow',
    },
    [flight],
    { currentDate },
  );

  assert.equal(results.length, 1);
});
