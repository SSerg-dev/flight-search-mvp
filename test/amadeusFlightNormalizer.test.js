import assert from 'node:assert/strict';
import test from 'node:test';

import {
  amadeusFlightOffersFixture,
  amadeusMissingOptionalFieldsFixture,
} from './fixtures/amadeusFlightOffers.js';
import { normalizeAmadeusFlightOffers } from '../src/services/normalizers/amadeusFlightNormalizer.js';

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

test('normalizes Amadeus flight offers into the app flight shape', () => {
  const [flight] = normalizeAmadeusFlightOffers(amadeusFlightOffersFixture, { query });

  assert.deepEqual(flight, {
    id: 'amadeus-offer-1',
    airline: {
      name: 'Turkish Airlines',
      code: 'TK',
      flightNumbers: ['TK82', 'TK401'],
    },
    price: {
      amount: 884,
      currency: 'USD',
      display: '$884',
      passengerCount: 2,
    },
    route: {
      origin: {
        city: 'Boston',
        airport: 'Boston Logan International',
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
      totalMinutes: 1300,
      display: '21h 40m',
      layoverMinutes: 270,
      layoverDisplay: '4.5h layover',
    },
    availability: {
      seats: 4,
      canBookAdults: true,
    },
  });
});

test('uses safe defaults for missing optional Amadeus fields', () => {
  const [flight] = normalizeAmadeusFlightOffers(amadeusMissingOptionalFieldsFixture, { query });

  assert.equal(flight.airline.name, 'Unknown airline');
  assert.equal(flight.price.amount, 0);
  assert.equal(flight.price.currency, 'USD');
  assert.equal(flight.price.passengerCount, 2);
  assert.equal(flight.availability.seats, 2);
  assert.equal(flight.availability.canBookAdults, true);
  assert.equal(flight.route.origin.airport, '');
  assert.equal(flight.route.stopover.airport, '');
  assert.equal(flight.route.destination.airport, '');
});

test('throws a controlled error for malformed Amadeus responses', () => {
  assert.throws(
    () => normalizeAmadeusFlightOffers({ data: [{ id: 'bad-offer' }] }, { query }),
    {
      message: 'Amadeus flight offer is missing itinerary segments.',
    },
  );
});
