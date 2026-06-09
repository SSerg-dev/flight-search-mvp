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
  assert.match(markup, new RegExp(mockFlights[0].airline));
  assert.match(markup, new RegExp(`\\$${mockFlights[0].price}`));
  assert.match(markup, new RegExp(mockFlights[0].departureDate));
  assert.match(markup, new RegExp(`${mockFlights[0].layoverHours}h layover`));
  assert.match(markup, new RegExp(mockFlights[0].totalDuration));
  assert.match(markup, /2 adults/);
});

test('results list renders matching result cards', () => {
  const markup = createResultsList(mockFlights.slice(0, 2));

  assert.match(markup, /2 matching flights/);
  assert.match(markup, new RegExp(mockFlights[0].airline));
  assert.match(markup, new RegExp(mockFlights[1].airline));
});

test('results list renders an empty state when no flights match', () => {
  const markup = createResultsList([]);

  assert.match(markup, /No matching flights found/);
  assert.match(markup, /Try changing the date range or layover hours/);
});
