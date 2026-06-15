import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeSerpApiFlightResults } from '../src/services/normalizers/serpapiFlightNormalizer.js';
import { serpapiGoogleFlightsFixture } from './fixtures/serpapiGoogleFlights.js';

const query = {
  from: 'Boston',
  via: 'Istanbul',
  to: 'Saint Petersburg',
  adults: 2,
};

test('normalizes SerpApi Google Flights results into the app flight shape', () => {
  const results = normalizeSerpApiFlightResults(serpapiGoogleFlightsFixture, { query });

  assert.equal(results.length, 1);
  assert.deepEqual(results[0], {
    id: 'serpapi-BOS-IST-LED-2026-08-01 21:35-TK82-TK401',
    airline: {
      name: 'Turkish Airlines',
      code: 'TK',
      flightNumbers: ['TK82', 'TK401'],
    },
    price: {
      amount: 713,
      currency: 'USD',
      display: '$713',
      passengerCount: 2,
    },
    route: {
      origin: {
        city: 'Boston',
        airport: 'Logan International Airport',
        code: 'BOS',
      },
      stopover: {
        city: 'Istanbul',
        airport: 'Istanbul Airport',
        code: 'IST',
      },
      destination: {
        city: 'Saint Petersburg',
        airport: 'Pulkovo Airport',
        code: 'LED',
      },
      departureDate: '2026-08-01',
    },
    segments: [
      {
        from: 'Boston',
        to: 'Istanbul',
        departure: '2026-08-01 21:35',
        arrival: '2026-08-02 14:25',
        flightNumber: 'TK82',
      },
      {
        from: 'Istanbul',
        to: 'Saint Petersburg',
        departure: '2026-08-02 18:55',
        arrival: '2026-08-03 02:15',
        flightNumber: 'TK401',
      },
    ],
    duration: {
      totalMinutes: 1360,
      display: '22h 40m',
      layoverMinutes: 270,
      layoverDisplay: '4h 30m layover',
    },
    availability: {
      seats: 2,
      canBookAdults: true,
    },
  });
});

test('filters SerpApi results to the requested stopover airport', () => {
  const results = normalizeSerpApiFlightResults(serpapiGoogleFlightsFixture, { query });

  assert.equal(results.length, 1);
  assert.equal(results[0].route.stopover.code, 'IST');
});

test('ignores multi-stop SerpApi results instead of displaying the wrong stopover', () => {
  const response = {
    best_flights: [
      {
        flights: [
          {
            departure_airport: { name: 'Logan International Airport', id: 'BOS', time: '2026-08-01 21:50' },
            arrival_airport: { name: 'Heathrow Airport', id: 'LHR', time: '2026-08-02 09:00' },
            duration: 430,
            airline: 'Turkish Airlines',
            flight_number: 'TK 82',
          },
          {
            departure_airport: { name: 'Heathrow Airport', id: 'LHR', time: '2026-08-02 12:00' },
            arrival_airport: { name: 'Istanbul Airport', id: 'IST', time: '2026-08-02 18:00' },
            duration: 240,
            airline: 'Turkish Airlines',
            flight_number: 'TK 1980',
          },
          {
            departure_airport: { name: 'Istanbul Airport', id: 'IST', time: '2026-08-02 19:30' },
            arrival_airport: { name: 'Pulkovo Airport', id: 'LED', time: '2026-08-02 23:15' },
            duration: 225,
            airline: 'Turkish Airlines',
            flight_number: 'TK 399',
          },
        ],
        layovers: [
          { duration: 180, name: 'Heathrow Airport', id: 'LHR' },
          { duration: 90, name: 'Istanbul Airport', id: 'IST' },
        ],
        total_duration: 1165,
        price: 2687,
      },
    ],
  };

  const results = normalizeSerpApiFlightResults(response, { query });

  assert.deepEqual(results, []);
});

test('normalizes the SerpApi card values from provider durations instead of local clock differences', () => {
  const response = {
    best_flights: [
      {
        flights: [
          {
            departure_airport: { name: 'Logan International Airport', id: 'BOS', time: '2026-08-01 21:50' },
            arrival_airport: { name: 'Istanbul Airport', id: 'IST', time: '2026-08-02 14:10' },
            duration: 560,
            airline: 'Turkish Airlines',
            flight_number: 'TK 82',
          },
          {
            departure_airport: { name: 'Istanbul Airport', id: 'IST', time: '2026-08-02 19:30' },
            arrival_airport: { name: 'Pulkovo Airport', id: 'LED', time: '2026-08-02 23:15' },
            duration: 225,
            airline: 'Turkish Airlines',
            flight_number: 'TK 399',
          },
        ],
        layovers: [{ duration: 320, name: 'Istanbul Airport', id: 'IST' }],
        total_duration: 1105,
        price: 2687,
      },
    ],
  };

  const [result] = normalizeSerpApiFlightResults(response, { query });

  assert.equal(result.duration.layoverDisplay, '5h 20m layover');
  assert.equal(result.duration.display, '18h 25m');
  assert.deepEqual(result.airline.flightNumbers, ['TK82', 'TK399']);
});

test('throws a controlled error for malformed SerpApi responses', () => {
  assert.throws(
    () =>
      normalizeSerpApiFlightResults(
        {
          best_flights: [
            {
              price: 123,
              flights: [{}, {}],
              layovers: [{ id: 'IST' }],
            },
          ],
        },
        { query },
      ),
    {
      message: 'SerpApi flight result is missing itinerary segments.',
    },
  );
});
