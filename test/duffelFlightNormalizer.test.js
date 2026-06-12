import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeDuffelOfferRequest } from '../src/services/normalizers/duffelFlightNormalizer.js';
import { duffelOfferRequestFixture } from './fixtures/duffelOfferRequest.js';

const query = {
  from: 'Boston',
  via: 'Istanbul',
  to: 'Saint Petersburg',
  adults: 2,
};

test('normalizes Duffel offer requests into the app flight shape', () => {
  const results = normalizeDuffelOfferRequest(duffelOfferRequestFixture, { query });

  assert.equal(results.length, 1);
  assert.deepEqual(results[0], {
    id: 'off_0000duffel',
    airline: {
      name: 'Turkish Airlines',
      code: 'TK',
      flightNumbers: ['TK82', 'TK401'],
    },
    price: {
      amount: 912.4,
      currency: 'USD',
      display: '$912.4',
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
      totalMinutes: 1720,
      display: '28h 40m',
      layoverMinutes: 270,
      layoverDisplay: '4.5h layover',
    },
    availability: {
      seats: 2,
      canBookAdults: true,
    },
  });
});

test('normalizes Duffel offers split across mandatory stopover slices', () => {
  const firstSegment = duffelOfferRequestFixture.data.offers[0].slices[0].segments[0];
  const secondSegment = duffelOfferRequestFixture.data.offers[0].slices[0].segments[1];
  const response = {
    data: {
      offers: [
        {
          ...duffelOfferRequestFixture.data.offers[0],
          slices: [
            {
              segments: [firstSegment],
            },
            {
              segments: [secondSegment],
            },
          ],
        },
      ],
    },
  };

  const results = normalizeDuffelOfferRequest(response, { query });

  assert.equal(results.length, 1);
  assert.deepEqual(
    results[0].segments.map((segment) => segment.flightNumber),
    ['TK82', 'TK401'],
  );
  assert.equal(results[0].route.stopover.code, 'IST');
  assert.equal(results[0].route.destination.code, 'LED');
});

test('throws a controlled error for malformed Duffel responses', () => {
  assert.throws(() => normalizeDuffelOfferRequest({ data: { offers: [{ id: 'bad-offer' }] } }, { query }), {
    message: 'Duffel offer is missing itinerary segments.',
  });
});
