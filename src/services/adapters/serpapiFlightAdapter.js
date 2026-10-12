import { normalizeSerpApiFlightResults } from '../normalizers/serpapiFlightNormalizer.js';
import { fetchSerpApiFlightOffers } from '../proxy/serpapiProxyClient.js';

export async function searchSerpApiFlightOffers(query, { config, fetchImpl, currentDate, onRequestComplete } = {}) {
  let response;
  try {
    response = await fetchSerpApiFlightOffers(query, {
      proxyUrl: config?.proxyUrl,
      fetchImpl,
    });
  } finally {
    void onRequestComplete?.();
  }

  try {
    return normalizeSerpApiFlightResults(response, {
      query,
      currentDate,
    });
  } catch {
    throw new Error('Flight API response could not be normalized.');
  }
}
