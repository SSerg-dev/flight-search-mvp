import assert from 'node:assert/strict';
import test from 'node:test';

import { clearSavedSearches, getSavedSearches, saveSearch } from '../src/utils/savedSearches.js';

const storageKey = 'flightSearch.recentSearches';

const baseQuery = {
  tripType: 'oneWay',
  from: 'Boston',
  via: 'Istanbul',
  to: 'Saint Petersburg',
  departureDate: '2026-08-01',
  dateRange: {
    start: '2026-08-01',
    end: '2026-08-10',
  },
  returnDateRange: {
    start: '',
    end: '',
  },
  adults: 2,
  minLayover: 3,
  maxLayover: 12,
};

test('returns an empty saved searches list when storage is empty', () => {
  assert.deepEqual(getSavedSearches(createStorage()), []);
});

test('ignores invalid saved searches JSON', () => {
  const storage = createStorage({
    [storageKey]: 'not-json',
  });

  assert.deepEqual(getSavedSearches(storage), []);
});

test('saves the newest search first', () => {
  const storage = createStorage();

  saveSearch(baseQuery, {
    storage,
    now: createNow('2026-08-01T10:00:00.000Z'),
  });
  const searches = saveSearch(
    {
      ...baseQuery,
      to: 'London',
    },
    {
      storage,
      now: createNow('2026-08-01T11:00:00.000Z'),
    },
  );

  assert.equal(searches.length, 2);
  assert.equal(searches[0].query.to, 'London');
  assert.equal(searches[1].query.to, 'Saint Petersburg');
});

test('deduplicates equivalent searches and moves the latest copy to the top', () => {
  const storage = createStorage();

  saveSearch(baseQuery, {
    storage,
    now: createNow('2026-08-01T10:00:00.000Z'),
  });
  saveSearch(
    {
      ...baseQuery,
      to: 'London',
    },
    {
      storage,
      now: createNow('2026-08-01T11:00:00.000Z'),
    },
  );
  const searches = saveSearch(baseQuery, {
    storage,
    now: createNow('2026-08-01T12:00:00.000Z'),
  });

  assert.equal(searches.length, 2);
  assert.equal(searches[0].query.to, 'Saint Petersburg');
  assert.equal(searches[0].createdAt, '2026-08-01T12:00:00.000Z');
});

test('limits saved searches to the configured max', () => {
  const storage = createStorage();

  for (let index = 0; index < 4; index += 1) {
    saveSearch(
      {
        ...baseQuery,
        to: `City ${index}`,
      },
      {
        storage,
        max: 3,
        now: createNow(`2026-08-01T1${index}:00:00.000Z`),
      },
    );
  }

  const searches = getSavedSearches(storage);

  assert.equal(searches.length, 3);
  assert.equal(searches[0].query.to, 'City 3');
  assert.equal(searches[2].query.to, 'City 1');
});

test('clearSavedSearches removes saved searches from storage', () => {
  const storage = createStorage();

  saveSearch(baseQuery, { storage });
  clearSavedSearches(storage);

  assert.equal(storage.getItem(storageKey), null);
});

function createStorage(initialValues = {}) {
  const values = new Map(Object.entries(initialValues));

  return {
    getItem(key) {
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      values.set(key, value);
    },
    removeItem(key) {
      values.delete(key);
    },
  };
}

function createNow(value) {
  return () => new Date(value);
}
