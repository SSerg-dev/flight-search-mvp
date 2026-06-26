import assert from 'node:assert/strict';
import test from 'node:test';

import { mockFlights } from '../src/data/mockFlights.js';
import { createResultCard } from '../src/components/resultCard.js';
import { createResultsList } from '../src/components/resultsList.js';
import {
  missingOptionalNormalizedFlightOffer,
  realisticNormalizedFlightOffer,
} from './fixtures/normalizedFlightOffers.js';

test('result card renders flight route, airline, price, dates, layover, and duration', () => {
  const markup = createResultCard(mockFlights[0]);

  assert.match(markup, /Boston/);
  assert.match(markup, /Istanbul/);
  assert.match(markup, /Saint Petersburg/);
  assert.match(markup, new RegExp(mockFlights[0].airline.name));
  assert.match(markup, new RegExp(`\\$${mockFlights[0].price.amount}`));
  assert.match(markup, new RegExp(mockFlights[0].route.departureDate));
  assert.match(markup, new RegExp(mockFlights[0].duration.layoverDisplay));
  assert.match(markup, new RegExp(mockFlights[0].duration.display));
  assert.match(
    markup,
    /Boston Depart 2026-08-01 <span class="font-bold italic">Saturday<\/span> at 21:35 -&gt; Istanbul Arrive 2026-08-02 at 14:25/,
  );
  assert.match(markup, /Istanbul Depart 2026-08-02 at 18:55 -&gt; Saint Petersburg Arrive 2026-08-03 at 02:15/);
  assert.match(markup, /2 adults/);
});

test('result card appends the weekday name only to the Boston departure date', () => {
  const markup = createResultCard({
    ...mockFlights[0],
    segments: [
      {
        ...mockFlights[0].segments[0],
        departure: '2026-08-09 21:50',
        arrival: '2026-08-10 14:10',
      },
      {
        ...mockFlights[0].segments[1],
        departure: '2026-08-10 21:45',
        arrival: '2026-08-11 01:30',
      },
    ],
  });

  assert.match(
    markup,
    /Boston Depart 2026-08-09 <span class="font-bold italic">Sunday<\/span> at 21:50 -&gt; Istanbul Arrive 2026-08-10 at 14:10/,
  );
  assert.match(markup, /Istanbul Depart 2026-08-10 at 21:45 -&gt; Saint Petersburg Arrive 2026-08-11 at 01:30/);
});

test('result card marks daytime departures with a sun badge', () => {
  const markup = createResultCard({
    ...mockFlights[0],
    segments: [
      {
        ...mockFlights[0].segments[0],
        departure: '2026-08-01 10:30',
      },
      mockFlights[0].segments[1],
    ],
  });

  assert.match(markup, /aria-label="Daytime departure"/);
  assert.match(markup, /Sun/);
  assert.match(markup, /Day departure/);
});

test('result card marks night departures with a night badge', () => {
  const markup = createResultCard({
    ...mockFlights[0],
    segments: [
      {
        ...mockFlights[0].segments[0],
        departure: '2026-08-01 21:35',
      },
      mockFlights[0].segments[1],
    ],
  });

  assert.match(markup, /aria-label="Night departure"/);
  assert.match(markup, /Moon/);
  assert.match(markup, /Night departure/);
});

test('result card hides misleading zero-hour layover durations', () => {
  const markup = createResultCard({
    ...realisticNormalizedFlightOffer,
    duration: {
      ...realisticNormalizedFlightOffer.duration,
      display: '3h 20m',
      layoverMinutes: 0,
      layoverDisplay: '0h layover',
    },
  });

  assert.match(markup, /<p>\s*Stay in Istanbul\s*<\/p>/);
  assert.match(markup, /<p class="font-semibold text-slate-900 dark:text-slate-100">\s*3h 20m\s*<\/p>/);
  assert.doesNotMatch(markup, /0h layover/);
  assert.doesNotMatch(markup, /3h 20m total/);
});

test('result card renders total duration as a separate bold line below the layover', () => {
  const markup = createResultCard(mockFlights[0]);

  assert.match(markup, /<p>\s*4\.5h layover in Istanbul\s*<\/p>/);
  assert.match(markup, /<p class="font-semibold text-slate-900 dark:text-slate-100">\s*21h 40m total\s*<\/p>/);
});

test('results list renders matching result cards', () => {
  const markup = createResultsList(mockFlights.slice(0, 2));

  assert.match(markup, /2 matching flights/);
  assert.match(markup, new RegExp(mockFlights[0].airline.name));
  assert.match(markup, new RegExp(mockFlights[1].airline.name));
});

test('results list connects matching flights to the selected departure range', () => {
  const markup = createResultsList(mockFlights.slice(0, 1), {
    query: {
      dateRange: {
        start: '2026-08-01',
        end: '2026-08-10',
      },
    },
  });

  assert.match(markup, /1 matching flight/);
  assert.match(markup, /Departures from 2026-08-01 to 2026-08-10/);
});

test('results list renders a custom section title', () => {
  const markup = createResultsList(mockFlights.slice(0, 1), {
    title: 'Outbound flights',
  });

  assert.match(markup, /Outbound flights/);
  assert.doesNotMatch(markup, /1 matching flight/);
});

test('results list renders a custom date range label', () => {
  const markup = createResultsList(mockFlights.slice(0, 1), {
    dateRangeLabel: 'Returns',
    query: {
      dateRange: {
        start: '2026-08-20',
        end: '2026-08-25',
      },
    },
  });

  assert.match(markup, /Returns from 2026-08-20 to 2026-08-25/);
});

test('result card handles realistic normalized provider data', () => {
  const markup = createResultCard(realisticNormalizedFlightOffer);

  assert.match(markup, /Very Long International Airways &amp; Partners/);
  assert.match(markup, /VL1234 \/ VL9876/);
  assert.match(markup, /1042.5 EUR/);
  assert.match(markup, /EUR total for 2 adults/);
  assert.match(markup, /Boston to Istanbul to Saint Petersburg/);
});

test('result card uses safe display fallbacks for missing optional provider fields', () => {
  const markup = createResultCard(missingOptionalNormalizedFlightOffer);

  assert.match(markup, /Unknown airline/);
  assert.match(markup, /Flight details pending/);
  assert.match(markup, /Price unavailable/);
  assert.doesNotMatch(markup, /undefined/);
  assert.doesNotMatch(markup, /null/);
});

test('results list copy works for mock or real provider estimates', () => {
  const markup = createResultsList([realisticNormalizedFlightOffer]);

  assert.match(markup, /Prices are estimates for the selected route/);
  assert.doesNotMatch(markup, /mock USD/);
});

test('results list renders an accessible sorting dropdown', () => {
  const markup = createResultsList(mockFlights.slice(0, 2), { sortBy: 'duration' });

  assert.match(markup, /<label[\s\S]*for="sortBy"[\s\S]*Sort results/);
  assert.match(markup, /name="sortBy"/);
  assert.match(markup, /Sort by price/);
  assert.match(markup, /Sort by duration/);
  assert.match(markup, /value="duration" selected/);
});

test('result cards and results list include responsive and interactive polish', () => {
  const cardMarkup = createResultCard(mockFlights[0]);
  const listMarkup = createResultsList(mockFlights.slice(0, 1));

  assert.match(cardMarkup, /hover:border-sky-300/);
  assert.match(cardMarkup, /hover:shadow-md/);
  assert.match(cardMarkup, /transition/);
  assert.match(cardMarkup, /sm:grid-cols-\[1fr_auto\]/);
  assert.match(listMarkup, /aria-live="polite"/);
});

test('results list renders an empty state when no flights match', () => {
  const markup = createResultsList([]);

  assert.match(markup, /No matching flights found/);
  assert.match(markup, /Try changing the date range or layover hours/);
});

test('results list empty state can include a custom section title', () => {
  const markup = createResultsList([], {
    title: 'Return flights',
  });

  assert.match(markup, /Return flights/);
  assert.match(markup, /No matching flights found/);
});

test('results list includes dark theme classes for headings, empty states, and sort controls', () => {
  const populatedMarkup = createResultsList(mockFlights.slice(0, 1));
  const emptyMarkup = createResultsList([]);

  assert.match(populatedMarkup, /dark:text-slate-100/);
  assert.match(populatedMarkup, /dark:text-slate-300/);
  assert.match(populatedMarkup, /dark:bg-slate-900/);
  assert.match(populatedMarkup, /dark:border-slate-700/);
  assert.match(emptyMarkup, /dark:bg-slate-900/);
  assert.match(emptyMarkup, /dark:border-slate-700/);
});
