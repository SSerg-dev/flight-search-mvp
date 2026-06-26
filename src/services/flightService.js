import { FLIGHT_API_MODES, getApiConfig } from '../config/apiConfig.js';
import { searchMockFlightOffers } from './adapters/mockFlightAdapter.js';
import { searchSerpApiFlightOffers } from './adapters/serpapiFlightAdapter.js';

export async function searchFlightOffers(query, options = {}) {
  if (query?.tripType === 'roundTrip') {
    const outbound = await searchOneWayFlightOffers(query, options);
    const returnResults = await searchOneWayFlightOffers(createReturnSearchQuery(query), options);

    return {
      outbound,
      return: returnResults,
    };
  }

  return searchOneWayFlightOffers(query, options);
}

async function searchOneWayFlightOffers(query, options = {}) {
  const config = getApiConfig(options.env);

  if (config.requestedMode === FLIGHT_API_MODES.SERPAPI && config.errors.proxyUrl) {
    throw new Error(config.errors.proxyUrl);
  }

  if (config.mode === FLIGHT_API_MODES.SERPAPI) {
    return searchSerpApiFlightOffers(query, {
      ...options,
      config,
    });
  }

  return searchMockFlightOffers(query, {
    ...options,
    config,
  });
}

function createReturnSearchQuery(query) {
  const returnDateRange = {
    start: query.returnDateRange?.start,
    end: query.returnDateRange?.end,
  };

  return {
    ...query,
    tripType: 'oneWay',
    from: query.to,
    to: query.from,
    via: query.via,
    departureDate: returnDateRange.start,
    dateRange: returnDateRange,
    returnDateRange: {
      start: '',
      end: '',
    },
  };
}
