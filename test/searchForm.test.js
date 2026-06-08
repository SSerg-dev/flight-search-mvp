import assert from 'node:assert/strict';
import test from 'node:test';

import * as searchForm from '../src/components/searchForm.js';

test('search form exposes the approved Wave 2 data model fields', () => {
  assert.deepEqual(Object.keys(searchForm.searchFormDefaults ?? {}), [
    'from',
    'via',
    'to',
    'departureDate',
    'dateRange',
    'adults',
    'minLayover',
    'maxLayover',
  ]);
});

test('search form renders all approved fields and the submit button', () => {
  const markup = searchForm.createSearchForm();

  [
    'From',
    'Via',
    'To',
    'Departure Date',
    'Date Range',
    'Adults',
    'Min Layover Hours',
    'Max Layover Hours',
    'Search Flights',
  ].forEach((text) => {
    assert.match(markup, new RegExp(text));
  });

  assert.match(markup, /name="from"/);
  assert.match(markup, /name="via"/);
  assert.match(markup, /name="to"/);
  assert.match(markup, /name="departureDate"/);
  assert.match(markup, /name="dateRangeStart"/);
  assert.match(markup, /name="dateRangeEnd"/);
  assert.match(markup, /name="adults"/);
  assert.match(markup, /name="minLayover"/);
  assert.match(markup, /name="maxLayover"/);
  assert.match(markup, /type="submit"/);
});
