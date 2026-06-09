import assert from 'node:assert/strict';
import test from 'node:test';

import { validateSearchQuery } from '../src/utils/validation.js';

const validQuery = {
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

test('accepts a complete valid search query', () => {
  assert.deepEqual(validateSearchQuery(validQuery), {
    isValid: true,
    errors: {},
  });
});

test('rejects empty required fields', () => {
  const result = validateSearchQuery({
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
  assert.equal(result.errors.via, 'Via is required.');
  assert.equal(result.errors.to, 'To is required.');
  assert.equal(result.errors.departureDate, 'Departure Date is required.');
  assert.equal(result.errors.dateRange, 'Date Range is required.');
  assert.equal(result.errors.adults, 'Adults is required.');
  assert.equal(result.errors.minLayover, 'Min Layover Hours is required.');
  assert.equal(result.errors.maxLayover, 'Max Layover Hours is required.');
});

test('rejects duplicate route points', () => {
  const result = validateSearchQuery({
    ...validQuery,
    to: 'Boston',
  });

  assert.equal(result.isValid, false);
  assert.equal(result.errors.route, 'From, Via, and To must be different.');
});

test('rejects invalid adults and date range', () => {
  const result = validateSearchQuery({
    ...validQuery,
    adults: 0,
    dateRange: {
      start: '2026-08-10',
      end: '2026-08-01',
    },
  });

  assert.equal(result.isValid, false);
  assert.equal(result.errors.adults, 'Adults must be at least 1.');
  assert.equal(result.errors.dateRange, 'Date Range start date must be before or equal to end date.');
});

test('rejects invalid layover range', () => {
  const result = validateSearchQuery({
    ...validQuery,
    minLayover: 13,
    maxLayover: 12,
  });

  assert.equal(result.isValid, false);
  assert.equal(result.errors.layover, 'Min Layover Hours cannot be greater than Max Layover Hours.');
});
