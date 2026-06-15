import assert from 'node:assert/strict';
import test from 'node:test';

import { getServiceErrorMessage } from '../src/utils/serviceErrorMessage.js';

test('uses safe service error messages from thrown errors', () => {
  assert.equal(
    getServiceErrorMessage(new Error('Flight API rate limit reached. Please try again later.')),
    'Flight API rate limit reached. Please try again later.',
  );
});

test('falls back to the generic service error for empty or non-error values', () => {
  assert.equal(getServiceErrorMessage(new Error('')), 'We could not load flight results. Please try again.');
  assert.equal(getServiceErrorMessage(undefined), 'We could not load flight results. Please try again.');
});
