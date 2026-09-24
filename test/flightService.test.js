import assert from 'node:assert/strict';
import test from 'node:test';

import { searchFlightOffers } from '../src/services/flightService.js';
import { serpapiGoogleFlightsFixture } from './fixtures/serpapiGoogleFlights.js';

const baseQuery = {
  tripType: 'oneWay',
  from: 'Boston',
  via: 'Istanbul',
  to: 'Saint Petersburg',
  departureDate: '2026-10-01',
  dateRange: {
    start: '2026-10-01',
    end: '2026-10-10',
  },
  returnDateRange: {
    start: '',
    end: '',
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

test('mock mode recalculates total prices for the selected number of adults', async () => {
  const options = {
    delayMs: 0,
    env: {
      VITE_FLIGHT_API_MODE: 'mock',
    },
  };
  const oneAdult = await searchFlightOffers({ ...baseQuery, adults: 1 }, options);
  const threeAdults = await searchFlightOffers({ ...baseQuery, adults: 3 }, options);

  assert.equal(threeAdults[0].price.amount, oneAdult[0].price.amount * 3);
  assert.equal(oneAdult[0].price.passengerCount, 1);
  assert.equal(threeAdults[0].price.passengerCount, 3);
  assert.equal(threeAdults[0].price.display, `$${threeAdults[0].price.amount}`);
});

test('searchFlightOffers returns outbound and return sections for round trips', async () => {
  const results = await searchFlightOffers(
    {
      ...baseQuery,
      fromAirportId: 'oa:3422',
      toAirportId: 'oa:6489',
      tripType: 'roundTrip',
      returnDateRange: {
        start: '2026-10-20',
        end: '2026-10-25',
      },
    },
    {
      delayMs: 0,
      env: {
        VITE_FLIGHT_API_MODE: 'mock',
      },
    },
  );

  assert.deepEqual(Object.keys(results), ['outbound', 'return']);
  assert.ok(Array.isArray(results.outbound));
  assert.ok(Array.isArray(results.return));
  assert.ok(results.outbound.length >= 1);
  assert.ok(results.return.length >= 1);
  assert.ok(results.outbound.every((flight) => flight.route.origin.city === 'Boston'));
  assert.ok(results.outbound.every((flight) => flight.route.destination.city === 'Saint Petersburg'));
  assert.ok(results.return.every((flight) => flight.route.origin.city === 'Saint Petersburg'));
  assert.ok(results.return.every((flight) => flight.route.destination.city === 'Boston'));
});

test('searchFlightOffers falls back to mock adapter for unsupported mode', async () => {
  const results = await searchFlightOffers(baseQuery, {
    delayMs: 0,
    env: {
      VITE_FLIGHT_API_MODE: 'unknown',
    },
  });

  assert.ok(results.length >= 2);
  assert.ok(results.every((flight) => flight.route.origin.city === baseQuery.from));
});

test('searchFlightOffers fails safely when SerpApi mode has no proxy URL', async () => {
  await assert.rejects(
    searchFlightOffers(baseQuery, {
      delayMs: 0,
      env: {
        VITE_FLIGHT_API_MODE: 'serpapi',
      },
    }),
    {
      message: 'Flight API proxy URL is required for SerpApi mode.',
    },
  );
});

test('searchFlightOffers surfaces a rate-limit error returned in a successful proxy response', async () => {
  await assert.rejects(
    searchFlightOffers(baseQuery, {
      fetchImpl: async () => ({
        ok: true,
        json: async () => ({ error: 'Your account has run out of searches.' }),
      }),
      env: {
        VITE_FLIGHT_API_MODE: 'serpapi',
        VITE_FLIGHT_API_PROXY_URL: 'https://example.com/api/serpapi-flights',
      },
    }),
    {
      message: 'Flight API rate limit reached. Please try again later.',
    },
  );
});

test('searchFlightOffers returns normalized SerpApi offers through configured proxy', async () => {
  const fetchImpl = async () => ({
    ok: true,
    json: async () => serpapiGoogleFlightsFixture,
  });

  const results = await searchFlightOffers(baseQuery, {
    fetchImpl,
    env: {
      VITE_FLIGHT_API_MODE: 'serpapi',
      VITE_FLIGHT_API_PROXY_URL: 'https://example.com/api/serpapi-flights',
    },
  });

  assert.equal(results.length, 1);
  assert.equal(results[0].airline.name, 'Turkish Airlines');
  assert.equal(results[0].price.display, '$1426');
  assert.equal(results[0].price.perAdultDisplay, '$713');
  assert.equal(results[0].route.stopover.city, 'Istanbul');
});

test('searchFlightOffers sends resolved airport IATA codes in SerpApi proxy payload', async () => {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });

    return {
      ok: true,
      json: async () => serpapiGoogleFlightsFixture,
    };
  };

  await searchFlightOffers(baseQuery, {
    fetchImpl,
    env: {
      VITE_FLIGHT_API_MODE: 'serpapi',
      VITE_FLIGHT_API_PROXY_URL: 'https://example.com/api/serpapi-flights',
    },
  });

  const payload = JSON.parse(calls[0].init.body);

  assert.equal(payload.provider, 'serpapi');
  assert.deepEqual(payload.route, {
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
  });
});

test('searchFlightOffers expands a city-wide endpoint into its airport codes', async () => {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });
    return { ok: true, json: async () => ({ best_flights: [], other_flights: [] }) };
  };

  await searchFlightOffers(
    {
      ...baseQuery,
      via: '',
      viaAirportId: '',
      connectionPreference: 'all',
      to: 'Moscow',
      toAirportId: 'city:ru:moscow',
    },
    {
      fetchImpl,
      env: {
        VITE_FLIGHT_API_MODE: 'serpapi',
        VITE_FLIGHT_API_PROXY_URL: 'https://example.com/api/serpapi-flights',
      },
    },
  );

  const payload = JSON.parse(calls[0].init.body);
  assert.equal(payload.route.to.query, 'Moscow');
  assert.equal(payload.route.to.iata, 'DME,SVO,VKO,ZIA');
});

test('searchFlightOffers sends reversed route and return dates for round-trip proxy searches', async () => {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });

    return {
      ok: true,
      json: async () => serpapiGoogleFlightsFixture,
    };
  };

  await searchFlightOffers(
    {
      ...baseQuery,
      fromAirportId: 'oa:3422',
      toAirportId: 'oa:6489',
      tripType: 'roundTrip',
      returnDateRange: {
        start: '2026-10-20',
        end: '2026-10-25',
      },
    },
    {
      fetchImpl,
      env: {
        VITE_FLIGHT_API_MODE: 'serpapi',
        VITE_FLIGHT_API_PROXY_URL: 'https://example.com/api/serpapi-flights',
      },
    },
  );

  assert.equal(calls.length, 2);

  const outboundPayload = JSON.parse(calls[0].init.body);
  const returnPayload = JSON.parse(calls[1].init.body);

  assert.equal(outboundPayload.route.from.iata, 'BOS');
  assert.equal(outboundPayload.route.to.iata, 'LED');
  assert.equal(outboundPayload.dateRange.start, '2026-10-01');
  assert.equal(outboundPayload.dateRange.end, '2026-10-10');
  assert.equal(returnPayload.route.from.iata, 'LED');
  assert.equal(returnPayload.route.to.iata, 'BOS');
  assert.equal(returnPayload.route.via.iata, 'IST');
  assert.equal(returnPayload.departureDate, '2026-10-20');
  assert.equal(returnPayload.dateRange.start, '2026-10-20');
  assert.equal(returnPayload.dateRange.end, '2026-10-25');
});
