import assert from 'node:assert/strict';
import test from 'node:test';

import {
  filterFlightResultsByConnection,
  getAvailableConnectionOptions,
  groupFlightsByConnection,
} from '../src/utils/flightConnections.js';
import { mockFlights } from '../src/data/mockFlights.js';

const directFlight = {
  ...structuredClone(mockFlights[0]),
  id: 'direct-flight',
  route: {
    ...structuredClone(mockFlights[0].route),
    stopover: null,
  },
  segments: [structuredClone(mockFlights[0].segments[0])],
};

const londonFlight = {
  ...structuredClone(mockFlights[4]),
};

test('connection options place direct first and list discovered airports', () => {
  const options = getAvailableConnectionOptions([mockFlights[0], londonFlight, directFlight]);

  assert.deepEqual(options.map((option) => option.key), ['direct', 'via:IST', 'via:LHR']);
});

test('connection options use the intersection for round trips', () => {
  const options = getAvailableConnectionOptions({
    outbound: [mockFlights[0], londonFlight, directFlight],
    return: [mockFlights[1], directFlight],
  });

  assert.deepEqual(options.map((option) => option.key), ['direct', 'via:IST']);
});

test('filters discovered results for direct and selected Via preferences', () => {
  const flights = [mockFlights[0], londonFlight, directFlight];

  assert.deepEqual(
    filterFlightResultsByConnection(flights, { connectionPreference: 'direct' }).map((flight) => flight.id),
    ['direct-flight'],
  );
  assert.deepEqual(
    filterFlightResultsByConnection(flights, { connectionPreference: 'via', via: 'Istanbul' }).map((flight) => flight.id),
    [mockFlights[0].id],
  );
});

test('groups direct flights before connection airports', () => {
  const groups = groupFlightsByConnection([mockFlights[0], londonFlight, directFlight]);

  assert.deepEqual(groups.map((group) => group.key), ['direct', 'via:IST', 'via:LHR']);
});
