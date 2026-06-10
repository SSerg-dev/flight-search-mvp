import { FLIGHT_API_MODES, getApiConfig } from '../config/apiConfig.js';
import { searchAmadeusFlightOffers } from './adapters/amadeusFlightAdapter.js';
import { searchMockFlightOffers } from './adapters/mockFlightAdapter.js';

export async function searchFlightOffers(query, options = {}) {
  const config = getApiConfig(options.env);

  if (config.requestedMode === FLIGHT_API_MODES.AMADEUS && config.errors.proxyUrl) {
    throw new Error(config.errors.proxyUrl);
  }

  if (config.mode === FLIGHT_API_MODES.AMADEUS) {
    return searchAmadeusFlightOffers(query, {
      ...options,
      config,
    });
  }

  return searchMockFlightOffers(query, {
    ...options,
    config,
  });
}
