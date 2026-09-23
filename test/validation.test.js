import assert from 'node:assert/strict';
import test from 'node:test';

import { validateSearchQuery } from '../src/utils/validation.js';

const currentDate = new Date('2026-09-04T12:00:00');

const validQuery = {
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

test('accepts a complete valid search query', () => {
  assert.deepEqual(validate(validQuery), {
    isValid: true,
    errors: {},
  });
});

test('accepts a search without a Via airport', () => {
  assert.deepEqual(validate({ ...validQuery, via: '', viaAirportId: '' }), {
    isValid: true,
    errors: {},
  });
});

test('accepts a city-wide route endpoint', () => {
  assert.deepEqual(
    validate({
      ...validQuery,
      to: 'Moscow',
      toAirportId: 'city:ru:moscow',
      via: '',
      viaAirportId: '',
      connectionPreference: 'all',
    }),
    { isValid: true, errors: {} },
  );
});

test('rejects empty required fields', () => {
  const result = validate({
    from: '',
    via: '',
    to: '',
    departureDate: '',
    dateRange: {
      start: '',
      end: '',
    },
    adults: '',
    minLayover: '',
    maxLayover: '',
  });

  assert.equal(result.isValid, false);
  assert.equal(result.errors.from, 'From is required.');
  assert.equal(result.errors.via, undefined);
  assert.equal(result.errors.to, 'To is required.');
  assert.equal(result.errors.departureDate, undefined);
  assert.equal(result.errors.dateRange, 'Date Range is required.');
  assert.equal(result.errors.adults, 'Adults is required.');
  assert.equal(result.errors.minLayover, 'Min Layover Hours is required.');
  assert.equal(result.errors.maxLayover, 'Max Layover Hours is required.');
});

test('rejects duplicate route points', () => {
  const result = validate({
    ...validQuery,
    to: 'Boston',
  });

  assert.equal(result.isValid, false);
  assert.equal(result.errors.route, 'From, Via, and To must be different.');
});

test('rejects unsupported airport entries', () => {
  const result = validate({
    ...validQuery,
    from: 'Unknown Airport',
  });

  assert.equal(result.isValid, false);
  assert.equal(result.errors.from, 'Choose a supported From airport.');
});

test('rejects invalid adults and date range', () => {
  const result = validate({
    ...validQuery,
    adults: 0,
    dateRange: {
      start: '2026-10-10',
      end: '2026-10-01',
    },
  });

  assert.equal(result.isValid, false);
  assert.equal(result.errors.adults, 'Adults must be at least 1.');
  assert.equal(result.errors.dateRange, 'Date Range start date must be before or equal to end date.');
});

test('rejects impossible or past departure dates', () => {
  const invalidDateResult = validate({
    ...validQuery,
    dateRange: {
      start: '2026-02-30',
      end: '2026-10-01',
    },
  });
  const pastDateResult = validate({
    ...validQuery,
    dateRange: {
      start: '2026-09-04',
      end: '2026-09-10',
    },
  });

  assert.equal(invalidDateResult.errors.dateRange, 'Date Range must use valid dates.');
  assert.equal(pastDateResult.errors.dateRange, 'Departure Date Start must be after today.');
});

test('rejects invalid layover range', () => {
  const result = validate({
    ...validQuery,
    minLayover: 13,
    maxLayover: 12,
  });

  assert.equal(result.isValid, false);
  assert.equal(result.errors.layover, 'Min Layover Hours cannot be greater than Max Layover Hours.');
});

test('requires return dates for round-trip searches', () => {
  const result = validate({
    ...validQuery,
    tripType: 'roundTrip',
    returnDateRange: {
      start: '',
      end: '',
    },
  });

  assert.equal(result.isValid, false);
  assert.equal(result.errors.returnDateRange, 'Return Date Range is required for round trips.');
});

test('rejects invalid round-trip return date ranges', () => {
  const result = validate({
    ...validQuery,
    tripType: 'roundTrip',
    returnDateRange: {
      start: '2026-10-25',
      end: '2026-10-20',
    },
  });

  assert.equal(result.isValid, false);
  assert.equal(result.errors.returnDateRange, 'Return Date Range start date must be before or equal to end date.');
});

test('rejects return dates before the outbound date range ends', () => {
  const result = validate({
    ...validQuery,
    tripType: 'roundTrip',
    returnDateRange: {
      start: '2026-10-09',
      end: '2026-10-20',
    },
  });

  assert.equal(result.isValid, false);
  assert.equal(result.errors.returnDateRange, 'Return Date Start cannot be earlier than Departure Date End.');
});

function validate(query) {
  return validateSearchQuery(query, { currentDate });
}
