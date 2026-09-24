import assert from 'node:assert/strict';
import test from 'node:test';

import { getInitialDataMode, persistDataMode } from '../src/utils/flightDataMode.js';

test('getInitialDataMode restores a saved supported mode', () => {
  assert.equal(getInitialDataMode('mock', createStorage('serpapi')), 'serpapi');
  assert.equal(getInitialDataMode('serpapi', createStorage('mock')), 'mock');
});

test('getInitialDataMode uses the configured default for missing or invalid values', () => {
  assert.equal(getInitialDataMode('serpapi', createStorage(null)), 'serpapi');
  assert.equal(getInitialDataMode('serpapi', createStorage('auto')), 'serpapi');
  assert.equal(getInitialDataMode('unknown', createStorage(null)), 'mock');
});

test('persistDataMode saves supported modes only', () => {
  const storage = createStorage(null);

  persistDataMode('serpapi', storage);
  assert.equal(storage.getItem('flight-search:data-mode'), 'serpapi');

  persistDataMode('auto', storage);
  assert.equal(storage.getItem('flight-search:data-mode'), 'serpapi');
});

test('getInitialDataMode tolerates unavailable browser storage', () => {
  const storage = {
    getItem() {
      throw new Error('Storage unavailable');
    },
  };

  assert.equal(getInitialDataMode('serpapi', storage), 'serpapi');
});

function createStorage(initialValue) {
  let value = initialValue;

  return {
    getItem(key) {
      return key === 'flight-search:data-mode' ? value : null;
    },
    setItem(key, nextValue) {
      if (key === 'flight-search:data-mode') {
        value = nextValue;
      }
    },
  };
}
