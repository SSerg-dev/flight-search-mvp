const QUOTA_ERROR = 'SerpApi quota is unavailable.';

export function createSerpApiAccountHandler({ env = {}, fetchImpl = globalThis.fetch } = {}) {
  return async function handleAccountRequest(request) {
    if (request?.method !== 'GET') return jsonResponse(405, { error: 'Method not allowed.' });
    if (!String(env.SERPAPI_API_KEY ?? '').trim()) return jsonResponse(500, { error: QUOTA_ERROR });

    try {
      const url = new URL('/account.json', env.SERPAPI_API_BASE_URL || 'https://serpapi.com');
      url.searchParams.set('api_key', env.SERPAPI_API_KEY);
      const response = await fetchImpl(url.toString(), { signal: AbortSignal.timeout(8000) });
      if (!response?.ok) return jsonResponse(502, { error: QUOTA_ERROR });
      const account = await response.json();
      const remaining = account?.total_searches_left;
      const limit = account?.searches_per_month;
      if (!Number.isSafeInteger(remaining) || remaining < 0 || !Number.isSafeInteger(limit) || limit < 1) {
        return jsonResponse(502, { error: QUOTA_ERROR });
      }
      return jsonResponse(200, { remaining, limit });
    } catch {
      return jsonResponse(502, { error: QUOTA_ERROR });
    }
  };
}

export default async function serpapiAccountHandler(request, response) {
  const result = await createSerpApiAccountHandler({ env: globalThis.process?.env ?? {} })(request);
  if (response && typeof response.status === 'function' && typeof response.json === 'function') {
    response.setHeader?.('Cache-Control', 'no-store');
    return response.status(result.status).json(JSON.parse(result.body));
  }
  return result;
}

function jsonResponse(status, body) {
  return { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify(body) };
}
