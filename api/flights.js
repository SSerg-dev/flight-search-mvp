const DEFAULT_AMADEUS_API_BASE_URL = 'https://test.api.amadeus.com';

export function createAmadeusProxyHandler({ env = {}, fetchImpl = globalThis.fetch } = {}) {
  return async function handleAmadeusProxyRequest(request) {
    if (request?.method !== 'POST') {
      return jsonResponse(405, {
        error: 'Method not allowed.',
      });
    }

    if (!hasText(env.AMADEUS_CLIENT_ID) || !hasText(env.AMADEUS_CLIENT_SECRET)) {
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
      const apiBaseUrl = getApiBaseUrl(env);
      const token = await requestAmadeusToken({
        apiBaseUrl,
        clientId: env.AMADEUS_CLIENT_ID,
        clientSecret: env.AMADEUS_CLIENT_SECRET,
        fetchImpl,
      });
      const flightOffers = await requestAmadeusFlightOffers({
        apiBaseUrl,
        payload,
        token,
        fetchImpl,
      });

      return jsonResponse(200, flightOffers);
    } catch (error) {
      return jsonResponse(getSafeStatus(error.status), {
        error: getSafeErrorMessage(error.status),
      });
    }
  };
}

export default async function amadeusProxyHandler(request, response) {
  const result = await createAmadeusProxyHandler({
    env: getDefaultEnv(),
    fetchImpl: globalThis.fetch,
  })(normalizeRequest(request));

  if (response && typeof response.status === 'function' && typeof response.json === 'function') {
    return response.status(result.status).json(JSON.parse(result.body));
  }

  return result;
}

async function requestAmadeusToken({ apiBaseUrl, clientId, clientSecret, fetchImpl }) {
  const response = await fetchImpl(`${apiBaseUrl}/v1/security/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }).toString(),
  });

  if (!response?.ok) {
    throw createProxyError(response?.status);
  }

  const data = await response.json();

  if (!hasText(data?.access_token)) {
    throw createProxyError(502);
  }

  return data.access_token;
}

async function requestAmadeusFlightOffers({ apiBaseUrl, payload, token, fetchImpl }) {
  const response = await fetchImpl(`${apiBaseUrl}/v2/shopping/flight-offers`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/vnd.amadeus+json',
    },
    body: JSON.stringify(buildFlightOffersSearchBody(payload)),
  });

  if (!response?.ok) {
    throw createProxyError(response?.status);
  }

  return response.json();
}

function buildFlightOffersSearchBody(payload) {
  return {
    currencyCode: 'USD',
    originDestinations: [
      {
        id: '1',
        originLocationCode: payload.route.from.iata,
        destinationLocationCode: payload.route.to.iata,
        departureDateTimeRange: {
          date: payload.departureDate,
        },
        includedConnectionPoints: [payload.route.via.iata],
      },
    ],
    travelers: Array.from({ length: Number(payload.adults) }, (_, index) => ({
      id: String(index + 1),
      travelerType: 'ADULT',
    })),
    sources: ['GDS'],
    searchCriteria: {
      maxFlightOffers: 20,
    },
  };
}

function isValidProxyPayload(payload) {
  return (
    payload?.provider === 'amadeus' &&
    hasText(payload.route?.from?.iata) &&
    hasText(payload.route?.via?.iata) &&
    hasText(payload.route?.to?.iata) &&
    hasText(payload.departureDate) &&
    Number.isFinite(Number(payload.adults)) &&
    Number(payload.adults) >= 1
  );
}

function getApiBaseUrl(env) {
  return String(env.AMADEUS_API_BASE_URL || DEFAULT_AMADEUS_API_BASE_URL).replace(/\/+$/, '');
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
