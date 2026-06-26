import assert from 'node:assert/strict';
import test from 'node:test';

import { applyTheme, getInitialTheme, getNextTheme, persistTheme } from '../src/utils/theme.js';

test('getInitialTheme uses a saved dark or light preference', () => {
  assert.equal(getInitialTheme(createStorage('dark')), 'dark');
  assert.equal(getInitialTheme(createStorage('light')), 'light');
});

test('getInitialTheme falls back to light for missing or invalid saved values', () => {
  assert.equal(getInitialTheme(createStorage(null)), 'light');
  assert.equal(getInitialTheme(createStorage('system')), 'light');
});

test('applyTheme toggles the dark class on the document element', () => {
  const documentElement = createDocumentElement();

  applyTheme('dark', { documentElement });
  assert.equal(documentElement.classList.contains('dark'), true);

  applyTheme('light', { documentElement });
  assert.equal(documentElement.classList.contains('dark'), false);
});

test('persistTheme saves the selected theme', () => {
  const storage = createStorage(null);

  persistTheme('dark', storage);

  assert.equal(storage.getItem('theme'), 'dark');
});

test('getNextTheme switches between light and dark', () => {
  assert.equal(getNextTheme('light'), 'dark');
  assert.equal(getNextTheme('dark'), 'light');
});

function createStorage(initialValue) {
  let value = initialValue;

  return {
    getItem(key) {
      return key === 'theme' ? value : null;
    },
    setItem(key, nextValue) {
      if (key === 'theme') {
        value = nextValue;
      }
    },
  };
}

function createDocumentElement() {
  const values = new Set();

  return {
    classList: {
      add(value) {
        values.add(value);
      },
      remove(value) {
        values.delete(value);
      },
      contains(value) {
        return values.has(value);
      },
    },
  };
}
