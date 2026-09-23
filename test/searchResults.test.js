import assert from 'node:assert/strict';
import test from 'node:test';

import { createSearchResultsMarkup } from '../src/components/searchResults.js';
import { mockFlights } from '../src/data/mockFlights.js';

const roundTripQuery = {
  tripType: 'roundTrip',
  from: 'Boston',
  via: 'Istanbul',
  to: 'Saint Petersburg',
  dateRange: {
    start: '2026-10-01',
    end: '2026-10-10',
  },
  returnDateRange: {
    start: '2026-10-20',
    end: '2026-10-25',
  },
};

test('search results render one-way arrays with the standard results list', () => {
  const markup = createSearchResultsMarkup(mockFlights.slice(0, 1), {
    sortBy: 'price',
    query: roundTripQuery,
  });

  assert.match(markup, /1 matching flight/);
  assert.doesNotMatch(markup, /Round-trip options/);
});

test('search results render round-trip result objects as paired rows', () => {
  const markup = createSearchResultsMarkup(
    {
      outbound: mockFlights.slice(0, 1),
      return: mockFlights.slice(1, 2),
    },
    {
      sortBy: 'price',
      query: roundTripQuery,
    },
  );

  assert.match(markup, /Round-trip options/);
  assert.match(markup, /Option 1/);
  assert.match(markup, /Outbound flight/);
  assert.match(markup, /Return flight/);
  assert.doesNotMatch(markup, /Outbound flights/);
  assert.doesNotMatch(markup, /Return flights/);
});

test('search results group all-route searches by connection with direct first', () => {
  const directFlight = {
    ...structuredClone(mockFlights[0]),
    route: { ...structuredClone(mockFlights[0].route), stopover: null },
    segments: [structuredClone(mockFlights[0].segments[0])],
  };
  const markup = createSearchResultsMarkup([mockFlights[0], directFlight], {
    query: { ...roundTripQuery, tripType: 'oneWay', connectionPreference: 'all' },
  });

  assert.match(markup, /Direct flight/);
  assert.match(markup, /IST — Istanbul Airport, Istanbul/);
  assert.ok(markup.indexOf('Direct flight') < markup.indexOf('IST — Istanbul Airport, Istanbul'));
});
