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
      layoverDisplay: '4h 30m layover',
      scheduleAdjusted: false,
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

test('normalizes Duffel zero-padded flight numbers for display', () => {
  const firstSegment = {
    ...duffelOfferRequestFixture.data.offers[0].slices[0].segments[0],
    marketing_carrier: {
      iata_code: 'ZZ',
      name: 'Duffel Airways',
    },
    marketing_carrier_flight_number: '0403',
  };
  const secondSegment = {
    ...duffelOfferRequestFixture.data.offers[0].slices[0].segments[1],
    marketing_carrier: {
      iata_code: 'ZZ',
      name: 'Duffel Airways',
    },
    marketing_carrier_flight_number: '0007',
  };

  const results = normalizeDuffelOfferRequest(
    {
      data: {
        offers: [
          {
            ...duffelOfferRequestFixture.data.offers[0],
            slices: [
              {
                segments: [firstSegment, secondSegment],
              },
            ],
          },
        ],
      },
    },
    { query },
  );

  assert.deepEqual(results[0].airline.flightNumbers, ['ZZ403', 'ZZ7']);
  assert.deepEqual(
    results[0].segments.map((segment) => segment.flightNumber),
    ['ZZ403', 'ZZ7'],
  );
});

test('adjusts impossible Duffel stopover schedules from segment duration data', () => {
  const firstSegment = {
    ...duffelOfferRequestFixture.data.offers[0].slices[0].segments[0],
    departing_at: '2026-08-01T00:00:00',
    arriving_at: '2026-08-01T17:53:00',
    duration: 'PT17H53M',
  };
  const secondSegment = {
    ...duffelOfferRequestFixture.data.offers[0].slices[0].segments[1],
    departing_at: '2026-08-01T00:00:00',
    arriving_at: '2026-08-01T03:20:00',
    duration: 'PT4H20M',
  };

  const results = normalizeDuffelOfferRequest(
    {
      data: {
        offers: [
          {
            ...duffelOfferRequestFixture.data.offers[0],
            slices: [
              {
                segments: [firstSegment, secondSegment],
              },
            ],
          },
        ],
      },
    },
    { query },
  );

  assert.deepEqual(
    results[0].segments.map(({ from, to, departure, arrival }) => ({ from, to, departure, arrival })),
    [
      {
        from: 'Boston',
        to: 'Istanbul',
        departure: '2026-08-01 00:00',
        arrival: '2026-08-01 17:53',
      },
      {
        from: 'Istanbul',
        to: 'Saint Petersburg',
        departure: '2026-08-01 21:13',
        arrival: '2026-08-02 01:33',
      },
    ],
  );
  assert.equal(results[0].duration.layoverMinutes, 200);
  assert.equal(results[0].duration.layoverDisplay, '3h 20m layover');
  assert.equal(results[0].duration.scheduleAdjusted, true);
});

test('throws a controlled error for malformed Duffel responses', () => {
  assert.throws(() => normalizeDuffelOfferRequest({ data: { offers: [{ id: 'bad-offer' }] } }, { query }), {
    message: 'Duffel offer is missing itinerary segments.',
  });
});
