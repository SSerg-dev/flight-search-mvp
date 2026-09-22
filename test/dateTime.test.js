import assert from 'node:assert/strict';
import test from 'node:test';

import { getTodayDateString, isDateAfterToday, isFlightTimingValid, parseDateOnly, parseFlightDateTime } from '../src/utils/dateTime.js';

const currentDate = new Date('2026-09-04T12:00:00');

test('parseDateOnly accepts real calendar dates only', () => {
  assert.equal(parseDateOnly('2026-10-01').toISOString(), '2026-10-01T00:00:00.000Z');
  assert.equal(parseDateOnly('2026-02-30'), undefined);
  assert.equal(parseDateOnly('not-a-date'), undefined);
});

test('parseFlightDateTime accepts date and minute precision times', () => {
  assert.equal(parseFlightDateTime('2026-10-01 21:35').toISOString(), '2026-10-01T21:35:00.000Z');
  assert.equal(parseFlightDateTime('2026-10-01 25:35'), undefined);
});

test('getTodayDateString formats a local current date', () => {
  assert.equal(getTodayDateString(currentDate), '2026-09-04');
});

test('isDateAfterToday requires a date later than the current date', () => {
  assert.equal(isDateAfterToday('2026-09-05', currentDate), true);
  assert.equal(isDateAfterToday('2026-09-04', currentDate), false);
  assert.equal(isDateAfterToday('2026-09-03', currentDate), false);
});

test('isFlightTimingValid requires arrivals after departures and after today', () => {
  assert.equal(
    isFlightTimingValid(createFlight('2026-10-01 21:35', '2026-10-02 14:25'), {
      currentDate,
    }),
    true,
  );
  assert.equal(
    isFlightTimingValid(createFlight('2026-10-01 21:35', '2026-10-01 20:25'), {
      currentDate,
    }),
    false,
  );
  assert.equal(
    isFlightTimingValid(createFlight('2026-09-04 21:35', '2026-09-04 23:25'), {
      currentDate,
    }),
    false,
  );
});

function createFlight(departure, arrival) {
  return {
    segments: [
      {
        departure,
        arrival,
      },
    ],
  };
}
