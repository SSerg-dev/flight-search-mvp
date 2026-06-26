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

test('renders an accessible service error message', () => {
  const markup = createSearchStatus({
    isLoading: false,
    serviceError: 'We could not load flight results. Please try again.',
  });

  assert.match(markup, /We could not load flight results\. Please try again\./);
  assert.match(markup, /role="alert"/);
  assert.match(markup, /aria-live="assertive"/);
});

test('keeps validation errors separate from service errors', () => {
  const markup = createSearchStatus({
    serviceError: 'We could not load flight results. Please try again.',
  });

  assert.doesNotMatch(markup, /data-error-for=/);
});

test('status messages include dark theme classes', () => {
  const loadingMarkup = createSearchStatus({ isLoading: true });
  const errorMarkup = createSearchStatus({ serviceError: 'Flight API rate limit reached.' });

  assert.match(loadingMarkup, /dark:border-sky-800/);
  assert.match(loadingMarkup, /dark:bg-sky-950/);
  assert.match(loadingMarkup, /dark:text-sky-100/);
  assert.match(errorMarkup, /dark:border-red-800/);
  assert.match(errorMarkup, /dark:bg-red-950/);
  assert.match(errorMarkup, /dark:text-red-100/);
});
