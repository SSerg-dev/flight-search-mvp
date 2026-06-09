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

test('search form renders validation errors near related fields', () => {
  const markup = searchForm.createSearchForm({
    errors: {
      from: 'From is required.',
      route: 'From, Via, and To must be different.',
      dateRange: 'Date Range start date must be before or equal to end date.',
      layover: 'Min Layover Hours cannot be greater than Max Layover Hours.',
    },
  });

  assert.match(markup, /data-error-for="from"[\s\S]*From is required\./);
  assert.match(markup, /data-error-for="route"[\s\S]*From, Via, and To must be different\./);
  assert.match(markup, /data-error-for="dateRange"[\s\S]*Date Range start date must be before or equal to end date\./);
  assert.match(markup, /data-error-for="layover"[\s\S]*Min Layover Hours cannot be greater than Max Layover Hours\./);
});

test('creates the Wave 3 search query shape from submitted form data', () => {
  const formData = new FormData();

  formData.set('from', 'Boston');
  formData.set('via', 'Istanbul');
  formData.set('to', 'Saint Petersburg');
  formData.set('departureDate', '2026-08-01');
  formData.set('dateRangeStart', '2026-08-01');
  formData.set('dateRangeEnd', '2026-08-10');
  formData.set('adults', '2');
  formData.set('minLayover', '3');
  formData.set('maxLayover', '12');

  assert.deepEqual(searchForm.createSearchQueryFromFormData(formData), searchForm.searchFormDefaults);
});

test('escapes submitted values and validation messages before rendering', () => {
  const markup = searchForm.createSearchForm({
    values: {
      ...searchForm.searchFormDefaults,
      from: '"<Boston>"',
    },
    errors: {
      from: 'Use "Boston" <only>.',
    },
  });

  assert.match(markup, /value="&quot;&lt;Boston&gt;&quot;"/);
  assert.match(markup, /Use &quot;Boston&quot; &lt;only&gt;\./);
});

test('search form connects validation errors to inputs for assistive technology', () => {
  const markup = searchForm.createSearchForm({
    errors: {
      from: 'From is required.',
      adults: 'Adults must be at least 1.',
    },
  });

  assert.match(markup, /id="from-error"/);
  assert.match(markup, /aria-describedby="from-error"/);
  assert.match(markup, /aria-invalid="true"/);
  assert.match(markup, /id="adults-error"/);
  assert.match(markup, /aria-describedby="adults-error"/);
  assert.match(markup, /role="alert"/);
});

test('search form includes responsive spacing and full-width mobile submit action', () => {
  const markup = searchForm.createSearchForm();

  assert.match(markup, /py-6[\s\S]*sm:py-8[\s\S]*lg:py-10/);
  assert.match(markup, /grid[\s\S]*gap-5[\s\S]*lg:gap-6/);
  assert.match(markup, /w-full[\s\S]*sm:w-auto/);
});

test('search form disables submit button while loading', () => {
  const markup = searchForm.createSearchForm({ isLoading: true });

  assert.match(markup, /disabled/);
  assert.match(markup, /aria-busy="true"/);
  assert.match(markup, /Searching/);
});
