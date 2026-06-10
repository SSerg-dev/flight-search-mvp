import { normalizeAmadeusFlightOffers } from '../normalizers/amadeusFlightNormalizer.js';
import { fetchAmadeusFlightOffers } from '../proxy/amadeusProxyClient.js';

export async function searchAmadeusFlightOffers(query, { config, fetchImpl } = {}) {
  const response = await fetchAmadeusFlightOffers(query, {
    proxyUrl: config?.proxyUrl,
    fetchImpl,
  });

  try {
    return normalizeAmadeusFlightOffers(response, { query });
  } catch {
    throw new Error('Flight API response could not be normalized.');
  }
}
