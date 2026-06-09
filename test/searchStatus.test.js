import assert from 'node:assert/strict';
import test from 'node:test';

import { createSearchStatus } from '../src/components/searchStatus.js';

test('renders an accessible loading message while search is pending', () => {
  const markup = createSearchStatus({ isLoading: true });

  assert.match(markup, /Searching mock flight offers/);
  assert.match(markup, /aria-live="polite"/);
  assert.match(markup, /role="status"/);
});

test('renders nothing when search is not loading', () => {
  assert.equal(createSearchStatus({ isLoading: false }), '');
});
