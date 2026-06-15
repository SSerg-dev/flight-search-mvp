import { searchAirports } from '../airportMetadataService.js';

export function buildSerpApiProxyRequest(query) {
  return {
    provider: 'serpapi',
    route: {
      from: resolveRouteAirport(query.from, 'From'),
      via: resolveRouteAirport(query.via, 'Via'),
      to: resolveRouteAirport(query.to, 'To'),
    },
    departureDate: query.departureDate,
    dateRange: {
      start: query.dateRange?.start,
      end: query.dateRange?.end,
    },
    adults: Number(query.adults),
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

  try {
    return await response.json();
  } catch {
    throw new Error('Flight API returned an invalid response.');
  }
}

function resolveRouteAirport(value, label) {
  const airport = searchAirports(value, { limit: 1 })[0];

  if (!airport) {
    throw new Error(`Airport could not be resolved for ${label}.`);
  }

  return {
    query: value,
    iata: airport.iata,
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

function hasText(value) {
  return String(value ?? '').trim().length > 0;
}

function getDefaultFetch() {
  return globalThis.fetch;
}
