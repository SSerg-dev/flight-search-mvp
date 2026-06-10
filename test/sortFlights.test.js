import assert from 'node:assert/strict';
import test from 'node:test';

import { mockFlights } from '../src/data/mockFlights.js';
import { sortFlights } from '../src/utils/sortFlights.js';

test('sortFlights sorts by price from low to high without mutating input', () => {
  const input = [mockFlights[2], mockFlights[0], mockFlights[1]];
  const sorted = sortFlights(input, 'price');

  assert.deepEqual(
    sorted.map((flight) => flight.price.amount),
    [884, 932, 1018],
  );
  assert.deepEqual(
    input.map((flight) => flight.price.amount),
    [1018, 884, 932],
  );
});

test('sortFlights sorts by duration from short to long without mutating input', () => {
  const input = [mockFlights[1], mockFlights[0], mockFlights[2]];
  const sorted = sortFlights(input, 'duration');

  assert.deepEqual(
    sorted.map((flight) => flight.duration.totalMinutes),
    [1300, 1305, 1375],
  );
  assert.deepEqual(
    input.map((flight) => flight.duration.totalMinutes),
    [1375, 1300, 1305],
  );
});

test('sortFlights keeps original order for unsupported sort option', () => {
  const input = [mockFlights[1], mockFlights[0]];
  const sorted = sortFlights(input, 'unknown');

  assert.deepEqual(
    sorted.map((flight) => flight.id),
    input.map((flight) => flight.id),
  );
  assert.notEqual(sorted, input);
});
