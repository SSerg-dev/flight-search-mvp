import assert from 'node:assert/strict';
import test from 'node:test';

import { mockFlights } from '../src/data/mockFlights.js';
import { createResultCard } from '../src/components/resultCard.js';
import { createResultsList } from '../src/components/resultsList.js';

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
  assert.match(markup, /2 adults/);
});

test('results list renders matching result cards', () => {
  const markup = createResultsList(mockFlights.slice(0, 2));

  assert.match(markup, /2 matching flights/);
  assert.match(markup, new RegExp(mockFlights[0].airline.name));
  assert.match(markup, new RegExp(mockFlights[1].airline.name));
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
