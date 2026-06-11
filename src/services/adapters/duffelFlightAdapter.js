import { normalizeDuffelOfferRequest } from '../normalizers/duffelFlightNormalizer.js';
import { fetchDuffelFlightOffers } from '../proxy/duffelProxyClient.js';

export async function searchDuffelFlightOffers(query, { config, fetchImpl } = {}) {
  const response = await fetchDuffelFlightOffers(query, {
    proxyUrl: config?.proxyUrl,
    fetchImpl,
  });

  try {
    return normalizeDuffelOfferRequest(response, { query });
  } catch {
    throw new Error('Flight API response could not be normalized.');
  }
}
