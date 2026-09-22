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

const currentDate = new Date('2026-09-04T12:00:00');

test('normalizes SerpApi Google Flights results into the app flight shape', () => {
  const results = normalizeSerpApiFlightResults(serpapiGoogleFlightsFixture, { query, currentDate });

  assert.equal(results.length, 1);
  assert.deepEqual(results[0], {
    id: 'serpapi-BOS-IST-LED-2026-10-01 21:35-TK82-TK401',
    airline: {
      name: 'Turkish Airlines',
      code: 'TK',
      flightNumbers: ['TK82', 'TK401'],
    },
    price: {
      amount: 1426,
      currency: 'USD',
      display: '$1426',
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
      departureDate: '2026-10-01',
    },
    segments: [
      {
        from: 'Boston',
        to: 'Istanbul',
        departure: '2026-10-01 21:35',
        arrival: '2026-10-02 14:25',
        flightNumber: 'TK82',
      },
      {
        from: 'Istanbul',
        to: 'Saint Petersburg',
        departure: '2026-10-02 18:55',
        arrival: '2026-10-03 02:15',
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
  const results = normalizeSerpApiFlightResults(serpapiGoogleFlightsFixture, { query, currentDate });

  assert.equal(results.length, 1);
  assert.equal(results[0].route.stopover.code, 'IST');
});

test('deduplicates identical itineraries and keeps the cheapest price', () => {
  const expensiveOffer = structuredClone(serpapiGoogleFlightsFixture.best_flights[0]);
  const cheaperOffer = structuredClone(expensiveOffer);
  cheaperOffer.price = 640;

  const results = normalizeSerpApiFlightResults(
    {
      best_flights: [expensiveOffer],
      other_flights: [cheaperOffer],
    },
    { query, currentDate },
  );

  assert.equal(results.length, 1);
  assert.equal(results[0].price.amount, 1280);
  assert.equal(results[0].price.display, '$1280');
});

test('calculates the total SerpApi price for the selected number of adults', () => {
  const oneAdult = normalizeSerpApiFlightResults(serpapiGoogleFlightsFixture, {
    query: { ...query, adults: 1 },
    currentDate,
  });
  const threeAdults = normalizeSerpApiFlightResults(serpapiGoogleFlightsFixture, {
    query: { ...query, adults: 3 },
    currentDate,
  });

  assert.equal(oneAdult[0].price.amount, 713);
  assert.equal(oneAdult[0].price.display, '$713');
  assert.equal(oneAdult[0].price.passengerCount, 1);
  assert.equal(threeAdults[0].price.amount, 2139);
  assert.equal(threeAdults[0].price.display, '$2139');
  assert.equal(threeAdults[0].price.passengerCount, 3);
});

test('keeps same-day offers when any flight segment differs', () => {
  const firstOffer = structuredClone(serpapiGoogleFlightsFixture.best_flights[0]);
  const alternateOffer = structuredClone(firstOffer);
  alternateOffer.price = 900;
  alternateOffer.flights[1].flight_number = 'TK 399';
  alternateOffer.flights[1].departure_airport.time = '2026-10-02 19:30';
  alternateOffer.flights[1].arrival_airport.time = '2026-10-02 23:15';
  alternateOffer.layovers[0].duration = 320;

  const results = normalizeSerpApiFlightResults(
    {
      best_flights: [firstOffer, alternateOffer],
    },
    { query, currentDate },
  );

  assert.equal(results.length, 2);
  assert.deepEqual(
    results.map((flight) => flight.airline.flightNumbers),
    [
      ['TK82', 'TK401'],
      ['TK82', 'TK399'],
    ],
  );
});

test('normalizes direct flights when Via is empty', () => {
  const response = {
    best_flights: [
      {
        price: 500,
        total_duration: 510,
        flights: [
          {
            departure_airport: { name: 'Logan International Airport', id: 'BOS', time: '2026-10-01 20:00' },
            arrival_airport: { name: 'Pulkovo Airport', id: 'LED', time: '2026-10-02 10:30' },
            airline: 'Example Air',
            flight_number: 'EA 10',
            duration: 510,
          },
        ],
        layovers: [],
      },
    ],
  };

  const [flight] = normalizeSerpApiFlightResults(response, {
    query: { ...query, via: '', viaAirportId: '' },
    currentDate,
  });

  assert.equal(flight.route.stopover, null);
  assert.equal(flight.segments.length, 1);
  assert.equal(flight.duration.layoverMinutes, 0);
});

test('ignores multi-stop SerpApi results instead of displaying the wrong stopover', () => {
  const response = {
    best_flights: [
      {
        flights: [
          {
            departure_airport: { name: 'Logan International Airport', id: 'BOS', time: '2026-10-01 21:50' },
            arrival_airport: { name: 'Heathrow Airport', id: 'LHR', time: '2026-10-02 09:00' },
            duration: 430,
            airline: 'Turkish Airlines',
            flight_number: 'TK 82',
          },
          {
            departure_airport: { name: 'Heathrow Airport', id: 'LHR', time: '2026-10-02 12:00' },
            arrival_airport: { name: 'Istanbul Airport', id: 'IST', time: '2026-10-02 18:00' },
            duration: 240,
            airline: 'Turkish Airlines',
            flight_number: 'TK 1980',
          },
          {
            departure_airport: { name: 'Istanbul Airport', id: 'IST', time: '2026-10-02 19:30' },
            arrival_airport: { name: 'Pulkovo Airport', id: 'LED', time: '2026-10-02 23:15' },
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

  const results = normalizeSerpApiFlightResults(response, { query, currentDate });

  assert.deepEqual(results, []);
});

test('normalizes the SerpApi card values from provider durations instead of local clock differences', () => {
  const response = {
    best_flights: [
      {
        flights: [
          {
            departure_airport: { name: 'Logan International Airport', id: 'BOS', time: '2026-10-01 21:50' },
            arrival_airport: { name: 'Istanbul Airport', id: 'IST', time: '2026-10-02 14:10' },
            duration: 560,
            airline: 'Turkish Airlines',
            flight_number: 'TK 82',
          },
          {
            departure_airport: { name: 'Istanbul Airport', id: 'IST', time: '2026-10-02 19:30' },
            arrival_airport: { name: 'Pulkovo Airport', id: 'LED', time: '2026-10-02 23:15' },
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

  const [result] = normalizeSerpApiFlightResults(response, { query, currentDate });

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

test('filters SerpApi results whose arrival is not after departure or today', () => {
  const arrivalBeforeDeparture = structuredClone(serpapiGoogleFlightsFixture);
  arrivalBeforeDeparture.best_flights[0].flights[0].arrival_airport.time = '2026-10-01 20:25';

  const sameDayAsCurrentDate = structuredClone(serpapiGoogleFlightsFixture);
  sameDayAsCurrentDate.best_flights[0].flights[1].arrival_airport.time = '2026-09-04 23:25';

  assert.deepEqual(normalizeSerpApiFlightResults(arrivalBeforeDeparture, { query, currentDate }), []);
  assert.deepEqual(normalizeSerpApiFlightResults(sameDayAsCurrentDate, { query, currentDate }), []);
});
