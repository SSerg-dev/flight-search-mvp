import { mockFlights } from '../data/mockFlights.js';
import { searchFlights } from '../utils/searchFlights.js';

const DEFAULT_DELAY_MS = 150;

export async function searchFlightOffers(query, { delayMs = DEFAULT_DELAY_MS } = {}) {
  await wait(delayMs);

  return searchFlights(query, mockFlights);
}

function wait(delayMs) {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}
