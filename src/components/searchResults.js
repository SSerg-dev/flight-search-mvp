import { createResultsList } from './resultsList.js';
import { createRoundTripResultsList } from './roundTripResultsList.js';
import { sortFlights } from '../utils/sortFlights.js';

export function createSearchResultsMarkup(results, { sortBy = 'price', query } = {}) {
  if (isRoundTripResults(results)) {
    return createRoundTripResultsList(results, {
      sortBy,
      query,
    });
  }

  if (!Array.isArray(results)) {
    return '';
  }

  return createResultsList(sortFlights(results, sortBy), { sortBy, query });
}

function isRoundTripResults(results) {
  return Array.isArray(results?.outbound) && Array.isArray(results?.return);
}
