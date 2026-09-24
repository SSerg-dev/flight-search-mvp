import {
  findAirportById,
  findRouteLocationById,
  getRouteLocationIata,
  resolveAirport,
  resolveRouteLocation,
} from '../airportMetadataService.js';

export function buildSerpApiProxyRequest(query) {
  return {
    provider: 'serpapi',
    route: {
      from: resolveRouteAirport(query, 'from', 'From'),
      via: resolveRouteAirport(query, 'via', 'Via', { optional: true }),
      to: resolveRouteAirport(query, 'to', 'To'),
    },
    departureDate: query.departureDate,
    dateRange: {
      start: query.dateRange?.start,
      end: query.dateRange?.end,
    },
    adults: Number(query.adults),
    connectionPreference: query.connectionPreference ?? (query.via ? 'via' : 'all'),
    layover: {
      minHours: Number(query.minLayover),
      maxHours: Number(query.maxLayover),
    },
  };
}

export async function fetchSerpApiFlightOffers(query, { proxyUrl, fetchImpl = getDefaultFetch() } = {}) {
  if (!hasText(proxyUrl)) {
    throw new Error('Flight API proxy URL is required for SerpApi mode.');
  }

  if (typeof fetchImpl !== 'function') {
    throw new Error('Flight API proxy client requires fetch.');
  }

  const request = buildSerpApiProxyRequest(query);
  let response;

  try {
    response = await fetchImpl(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
  } catch {
    throw new Error('Flight API network request failed.');
  }

  if (!response?.ok) {
    throw new Error(getSafeResponseError(response?.status));
  }

  let payload;

  try {
    payload = await response.json();
  } catch {
    throw new Error('Flight API returned an invalid response.');
  }

  if (hasText(payload?.error)) {
    throw new Error(getSafeProviderError(payload.error));
  }

  return payload;
}

function resolveRouteAirport(query, fieldName, label, { optional = false } = {}) {
  const value = query?.[fieldName];
  const isConnection = fieldName === 'via';
  const airport = isConnection
    ? findAirportById(query?.[`${fieldName}AirportId`]) ?? resolveAirport(value)
    : findRouteLocationById(query?.[`${fieldName}AirportId`]) ?? resolveRouteLocation(value);

  if (optional && !String(value ?? '').trim() && !query?.[`${fieldName}AirportId`]) {
    return null;
  }

  if (!airport) {
    throw new Error(`Airport could not be resolved for ${label}.`);
  }

  return {
    query: value || airport.city,
    iata: isConnection ? airport.iata : getRouteLocationIata(airport),
  };
}

function getSafeResponseError(status) {
  if (status === 401 || status === 403) {
    return 'Flight API authorization failed.';
  }

  if (status === 429) {
    return 'Flight API rate limit reached. Please try again later.';
  }

  return 'We could not load flight results. Please try again.';
}

function getSafeProviderError(message) {
  if (/rate limit|run out of searches/i.test(String(message ?? ''))) {
    return 'Flight API rate limit reached. Please try again later.';
  }

  return 'We could not load flight results. Please try again.';
}

function hasText(value) {
  return String(value ?? '').trim().length > 0;
}

function getDefaultFetch() {
  return globalThis.fetch;
}
