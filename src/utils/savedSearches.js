const SAVED_SEARCHES_STORAGE_KEY = 'flightSearch.recentSearches';
const DEFAULT_MAX_SAVED_SEARCHES = 5;

export function getSavedSearches(storage = getDefaultStorage()) {
  try {
    const parsedValue = JSON.parse(storage?.getItem?.(SAVED_SEARCHES_STORAGE_KEY) ?? '[]');

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.map(normalizeSavedSearch).filter(Boolean);
  } catch {
    return [];
  }
}

export function saveSearch(query, { storage = getDefaultStorage(), now = () => new Date(), max = DEFAULT_MAX_SAVED_SEARCHES } = {}) {
  const normalizedQuery = normalizeSearchQuery(query);
  const id = createSavedSearchId(normalizedQuery);
  const savedSearch = {
    id,
    createdAt: now().toISOString(),
    query: normalizedQuery,
  };
  const existingSearches = getSavedSearches(storage).filter((search) => search.id !== id);
  const searches = [savedSearch, ...existingSearches].slice(0, Math.max(0, Number(max) || 0));

  persistSavedSearches(searches, storage);

  return searches;
}

export function clearSavedSearches(storage = getDefaultStorage()) {
  try {
    storage?.removeItem?.(SAVED_SEARCHES_STORAGE_KEY);
  } catch {
    // localStorage can be unavailable in private browsing or test environments.
  }
}

function persistSavedSearches(searches, storage) {
  try {
    storage?.setItem?.(SAVED_SEARCHES_STORAGE_KEY, JSON.stringify(searches));
  } catch {
    // A full or unavailable localStorage should never break flight search.
  }
}

function normalizeSavedSearch(value) {
  if (!hasText(value?.id) || !value?.query) {
    return undefined;
  }

  return {
    id: String(value.id),
    createdAt: hasText(value.createdAt) ? String(value.createdAt) : '',
    query: normalizeSearchQuery(value.query),
  };
}

function normalizeSearchQuery(query = {}) {
  const dateRangeStart = String(query.dateRange?.start ?? query.departureDate ?? '');

  return {
    tripType: query.tripType === 'roundTrip' ? 'roundTrip' : 'oneWay',
    from: String(query.from ?? '').trim(),
    via: String(query.via ?? '').trim(),
    to: String(query.to ?? '').trim(),
    departureDate: dateRangeStart,
    dateRange: {
      start: dateRangeStart,
      end: String(query.dateRange?.end ?? ''),
    },
    returnDateRange: {
      start: String(query.returnDateRange?.start ?? ''),
      end: String(query.returnDateRange?.end ?? ''),
    },
    adults: toOptionalNumber(query.adults),
    minLayover: toOptionalNumber(query.minLayover),
    maxLayover: toOptionalNumber(query.maxLayover),
  };
}

function createSavedSearchId(query) {
  const key = JSON.stringify(query);
  let hash = 0;

  for (let index = 0; index < key.length; index += 1) {
    hash = (hash * 31 + key.charCodeAt(index)) >>> 0;
  }

  return `search-${hash.toString(36)}`;
}

function toOptionalNumber(value) {
  if (String(value ?? '').trim() === '') {
    return '';
  }

  return Number(value);
}

function hasText(value) {
  return String(value ?? '').trim().length > 0;
}

function getDefaultStorage() {
  return globalThis.localStorage;
}
