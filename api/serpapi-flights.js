const DEFAULT_SERPAPI_API_BASE_URL = 'https://serpapi.com';

export function createSerpApiProxyHandler({ env = {}, fetchImpl = globalThis.fetch } = {}) {
  return async function handleSerpApiProxyRequest(request) {
    if (request?.method !== 'POST') {
      return jsonResponse(405, {
        error: 'Method not allowed.',
      });
    }

    if (!hasText(env.SERPAPI_API_KEY)) {
      return jsonResponse(500, {
        error: 'Flight API proxy is not configured.',
      });
    }

    let payload;

    try {
      payload = JSON.parse(request.body || '{}');
    } catch {
      return jsonResponse(400, {
        error: 'Flight API proxy request is invalid.',
      });
    }

    if (!isValidProxyPayload(payload)) {
      return jsonResponse(400, {
        error: 'Flight API proxy request is invalid.',
      });
    }

    try {
      const result = await requestSerpApiGoogleFlightsRange({
        apiBaseUrl: getApiBaseUrl(env),
        apiKey: env.SERPAPI_API_KEY,
        payload,
        fetchImpl,
      });

      return jsonResponse(200, result);
    } catch (error) {
      return jsonResponse(getSafeStatus(error.status), {
        error: getSafeErrorMessage(error.status),
      });
    }
  };
}

export default async function serpapiProxyHandler(request, response) {
  const result = await createSerpApiProxyHandler({
    env: getDefaultEnv(),
    fetchImpl: globalThis.fetch,
  })(normalizeRequest(request));

  if (response && typeof response.status === 'function' && typeof response.json === 'function') {
    return response.status(result.status).json(JSON.parse(result.body));
  }

  return result;
}

async function requestSerpApiGoogleFlightsRange({ apiBaseUrl, apiKey, payload, fetchImpl }) {
  const results = [];

  for (const departureDate of getDepartureDates(payload)) {
    results.push(
      await requestSerpApiGoogleFlights({
        apiBaseUrl,
        apiKey,
        payload: {
          ...payload,
          departureDate,
        },
        fetchImpl,
      }),
    );
  }

  return combineSerpApiGoogleFlightsResults(results);
}

async function requestSerpApiGoogleFlights({ apiBaseUrl, apiKey, payload, fetchImpl }) {
  const response = await fetchImpl(buildSerpApiUrl({ apiBaseUrl, apiKey, payload }));

  if (!response?.ok) {
    throw createProxyError(response?.status);
  }

  return response.json();
}

function combineSerpApiGoogleFlightsResults(results) {
  const [firstResult = {}] = results;

  return {
    ...firstResult,
    best_flights: results.flatMap((result) => (Array.isArray(result?.best_flights) ? result.best_flights : [])),
    other_flights: results.flatMap((result) => (Array.isArray(result?.other_flights) ? result.other_flights : [])),
  };
}

function buildSerpApiUrl({ apiBaseUrl, apiKey, payload }) {
  const url = new URL('/search', apiBaseUrl);
  const layover = payload.layover ?? {};
  const minLayoverMinutes = Math.round(Number(layover.minHours ?? 0) * 60);
  const maxLayoverMinutes = Math.round(Number(layover.maxHours ?? 0) * 60);

  url.searchParams.set('engine', 'google_flights');
  url.searchParams.set('type', '2');
  url.searchParams.set('departure_id', payload.route.from.iata);
  url.searchParams.set('arrival_id', payload.route.to.iata);
  url.searchParams.set('outbound_date', payload.departureDate);
  url.searchParams.set('adults', String(Number(payload.adults)));
  url.searchParams.set('currency', 'USD');
  url.searchParams.set('stops', '2');
  url.searchParams.set('api_key', apiKey);

  if (minLayoverMinutes > 0 && maxLayoverMinutes >= minLayoverMinutes) {
    url.searchParams.set('layover_duration', `${minLayoverMinutes},${maxLayoverMinutes}`);
  }

  return url.toString();
}

function getDepartureDates(payload) {
  const start = parseDateOnly(payload.dateRange?.start);
  const end = parseDateOnly(payload.dateRange?.end);

  if (!start || !end || start > end) {
    return [payload.departureDate];
  }

  const dates = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    dates.push(formatDateOnly(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return dates;
}

function parseDateOnly(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value ?? ''))) {
    return undefined;
  }

  const date = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date;
}

function formatDateOnly(date) {
  return date.toISOString().slice(0, 10);
}

function isValidProxyPayload(payload) {
  return (
    payload?.provider === 'serpapi' &&
    hasText(payload.route?.from?.iata) &&
    hasText(payload.route?.via?.iata) &&
    hasText(payload.route?.to?.iata) &&
    hasText(payload.departureDate) &&
    Number.isFinite(Number(payload.adults)) &&
    Number(payload.adults) >= 1
  );
}

function getApiBaseUrl(env) {
  return String(env.SERPAPI_API_BASE_URL || DEFAULT_SERPAPI_API_BASE_URL).replace(/\/+$/, '');
}

function normalizeRequest(request) {
  if (typeof request?.body === 'string') {
    return request;
  }

  return {
    ...request,
    body: JSON.stringify(request?.body ?? {}),
  };
}

function getDefaultEnv() {
  return globalThis.process?.env ?? {};
}

function createProxyError(status) {
  const error = new Error(getSafeErrorMessage(status));
  error.status = status;
  return error;
}

function getSafeStatus(status) {
  if (status === 401 || status === 403 || status === 429) {
    return status;
  }

  return 502;
}

function getSafeErrorMessage(status) {
  if (status === 401 || status === 403) {
    return 'Flight API authorization failed.';
  }

  if (status === 429) {
    return 'Flight API rate limit reached. Please try again later.';
  }

  return 'We could not load flight results. Please try again.';
}

function jsonResponse(status, body) {
  return {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };
}

function hasText(value) {
  return String(value ?? '').trim().length > 0;
}
