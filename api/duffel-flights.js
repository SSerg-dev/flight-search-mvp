const DEFAULT_DUFFEL_API_BASE_URL = 'https://api.duffel.com';

export function createDuffelProxyHandler({ env = {}, fetchImpl = globalThis.fetch } = {}) {
  return async function handleDuffelProxyRequest(request) {
    if (request?.method !== 'POST') {
      return jsonResponse(405, {
        error: 'Method not allowed.',
      });
    }

    if (!hasText(env.DUFFEL_ACCESS_TOKEN)) {
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
      const offerRequest = await requestDuffelOfferRequests({
        apiBaseUrl: getApiBaseUrl(env),
        payload,
        token: env.DUFFEL_ACCESS_TOKEN,
        fetchImpl,
      });

      return jsonResponse(200, offerRequest);
    } catch (error) {
      return jsonResponse(getSafeStatus(error.status), {
        error: getSafeErrorMessage(error.status),
      });
    }
  };
}

export default async function duffelProxyHandler(request, response) {
  const result = await createDuffelProxyHandler({
    env: getDefaultEnv(),
    fetchImpl: globalThis.fetch,
  })(normalizeRequest(request));

  if (response && typeof response.status === 'function' && typeof response.json === 'function') {
    return response.status(result.status).json(JSON.parse(result.body));
  }

  return result;
}

async function requestDuffelOfferRequests({ apiBaseUrl, payload, token, fetchImpl }) {
  const offerRequests = [];

  for (const departureDate of getDepartureDates(payload)) {
    offerRequests.push(
      await requestDuffelOfferRequest({
        apiBaseUrl,
        payload: {
          ...payload,
          departureDate,
        },
        token,
        fetchImpl,
      }),
    );
  }

  return combineDuffelOfferRequests(offerRequests);
}

async function requestDuffelOfferRequest({ apiBaseUrl, payload, token, fetchImpl }) {
  const response = await fetchImpl(`${apiBaseUrl}/air/offer_requests?return_offers=true`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Duffel-Version': 'v2',
    },
    body: JSON.stringify(buildDuffelOfferRequestBody(payload)),
  });

  if (!response?.ok) {
    throw createProxyError(response?.status);
  }

  return response.json();
}

function combineDuffelOfferRequests(offerRequests) {
  const [firstOfferRequest = { data: {} }] = offerRequests;

  return {
    ...firstOfferRequest,
    data: {
      ...firstOfferRequest.data,
      offers: offerRequests.flatMap((offerRequest) =>
        Array.isArray(offerRequest?.data?.offers) ? offerRequest.data.offers : [],
      ),
    },
  };
}

function buildDuffelOfferRequestBody(payload) {
  return {
    data: {
      slices: [
        {
          origin: payload.route.from.iata,
          destination: payload.route.via.iata,
          departure_date: payload.departureDate,
        },
        {
          origin: payload.route.via.iata,
          destination: payload.route.to.iata,
          departure_date: payload.departureDate,
        },
      ],
      passengers: Array.from({ length: Number(payload.adults) }, () => ({
        type: 'adult',
      })),
      cabin_class: 'economy',
    },
  };
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
    payload?.provider === 'duffel' &&
    hasText(payload.route?.from?.iata) &&
    hasText(payload.route?.via?.iata) &&
    hasText(payload.route?.to?.iata) &&
    hasText(payload.departureDate) &&
    Number.isFinite(Number(payload.adults)) &&
    Number(payload.adults) >= 1
  );
}

function getApiBaseUrl(env) {
  return String(env.DUFFEL_API_BASE_URL || DEFAULT_DUFFEL_API_BASE_URL).replace(/\/+$/, '');
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
