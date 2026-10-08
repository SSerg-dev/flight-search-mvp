import assert from 'node:assert/strict';
import test from 'node:test';
import { searchMockFlightOffers } from '../src/services/adapters/mockFlightAdapter.js';
import { mockFlights } from '../src/data/mockFlights.js';
import { parseFlightDateTime } from '../src/utils/dateTime.js';

const query = { from: 'Boston', to: 'Saint Petersburg', connectionPreference: 'all',
  dateRange: { start: '2027-12-31', end: '2028-01-01' }, adults: 2, minLayover: 0, maxLayover: 24 };
const options = { delayMs: 0, currentDate: new Date('2027-12-01T12:00:00Z') };

test('Demo follows the selected dates across years without altering templates or making requests', async () => {
  const original = structuredClone(mockFlights);
  const flights = await searchMockFlightOffers(query, { ...options, fetchImpl: () => { throw new Error('No network expected'); } });
  assert.ok(flights.length > 0);
  assert.deepEqual([...new Set(flights.map(flight => flight.route.departureDate))], ['2027-12-31', '2028-01-01']);
  assert.equal(new Set(flights.map(flight => flight.id)).size, flights.length);
  const first = flights[0];
  assert.equal(first.segments[0].departure, '2027-12-31 21:35');
  assert.equal(first.segments[1].arrival, '2028-01-02 02:15');
  assert.deepEqual(mockFlights, original);
});

test('reverse Demo flights retain leg durations and layover timing', async () => {
  const flights = await searchMockFlightOffers({ ...query, from: query.to, to: query.from }, options);
  assert.ok(flights.length > 0);
  const first = flights[0];
  assert.equal(first.segments[0].from, 'Saint Petersburg');
  assert.equal(first.segments[1].to, 'Boston');
  assert.equal((parseFlightDateTime(first.segments[1].departure) - parseFlightDateTime(first.segments[0].arrival)) / 60000,
    first.duration.layoverMinutes);
  const originalLeg = mockFlights[0].segments[1];
  assert.equal(parseFlightDateTime(first.segments[0].arrival) - parseFlightDateTime(first.segments[0].departure),
    parseFlightDateTime(originalLeg.arrival) - parseFlightDateTime(originalLeg.departure));
});

test('Demo returns no flights for past or excessive ranges', async () => {
  assert.deepEqual(await searchMockFlightOffers(query, { ...options, currentDate: new Date('2029-01-01T12:00:00Z') }), []);
  assert.deepEqual(await searchMockFlightOffers({ ...query, dateRange: { start: '2027-12-31', end: '2028-01-02' } }, options), []);
});
