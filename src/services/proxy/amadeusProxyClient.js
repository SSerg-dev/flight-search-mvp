export function buildAmadeusProxyRequest(query) {
  return {
    provider: 'amadeus',
    route: {
      from: query.from,
      via: query.via,
      to: query.to,
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

export async function fetchAmadeusFlightOffers(query, { proxyUrl, fetchImpl = getDefaultFetch() } = {}) {
  if (!hasText(proxyUrl)) {
    throw new Error('Flight API proxy URL is required for Amadeus mode.');
  }

  if (typeof fetchImpl !== 'function') {
    throw new Error('Flight API proxy client requires fetch.');
  }

  let response;

  try {
    response = await fetchImpl(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildAmadeusProxyRequest(query)),
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
