import assert from 'node:assert/strict';
import test from 'node:test';
import { getSearchRequestCount, normalizeSearchDates } from '../src/utils/searchDateRange.js';

test('moving the start clamps the end and keeps the original query intact', () => {
  const query = { dateRange: { start: '2026-12-31', end: '2027-01-15' }, returnDateRange: {} };
  assert.deepEqual(normalizeSearchDates(query).dateRange, { start: '2026-12-31', end: '2027-01-01' });
  assert.equal(query.dateRange.end, '2027-01-15');
  assert.equal(normalizeSearchDates({ ...query, dateRange: { start: '2026-12-31', end: '2026-12-01' } }).dateRange.end, '2026-12-31');
});

test('outbound changes move overlapping return dates and clamp their range', () => {
  const query = { tripType: 'roundTrip', dateRange: { start: '2027-01-01', end: '2027-01-02' },
    returnDateRange: { start: '2026-12-31', end: '2027-01-10' } };
  const result = normalizeSearchDates(query);
  assert.deepEqual(result.returnDateRange, { start: '2027-01-02', end: '2027-01-03' });
  assert.equal(result.departureDate, result.dateRange.start);
});

test('valid ranges are preserved and invalid starts remain available for validation', () => {
  const query = { tripType: 'roundTrip', dateRange: { start: '2028-02-28', end: '2028-02-29' },
    returnDateRange: { start: '2028-03-02', end: '2028-03-03' } };
  assert.deepEqual(normalizeSearchDates(query).returnDateRange, query.returnDateRange);
  assert.deepEqual(normalizeSearchDates({ dateRange: { start: '', end: '' } }).dateRange, { start: '', end: '' });
});

test('request estimates count actual dates and reject incomplete or excessive ranges', () => {
  const query = { dateRange: { start: '2027-01-01', end: '2027-01-01' } };
  assert.equal(getSearchRequestCount(query), 1);
  assert.equal(getSearchRequestCount({ ...query, dateRange: { start: '2027-01-01', end: '2027-01-02' } }), 2);
  assert.equal(getSearchRequestCount({ ...query, tripType: 'roundTrip',
    dateRange: { start: '2027-01-01', end: '2027-01-02' },
    returnDateRange: { start: '2027-01-04', end: '2027-01-05' } }), 4);
  assert.equal(getSearchRequestCount({ ...query, tripType: 'roundTrip' }), null);
  assert.equal(getSearchRequestCount({ dateRange: { start: '2027-01-01', end: '2027-01-03' } }), null);
});
