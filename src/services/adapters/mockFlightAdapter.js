import { mockFlights } from '../../data/mockFlights.js';
import { searchFlights } from '../../utils/searchFlights.js';

const DEFAULT_DELAY_MS = 150;

export async function searchMockFlightOffers(query, { delayMs = DEFAULT_DELAY_MS, shouldFail = false, ...options } = {}) {
  await wait(delayMs);

  if (shouldFail) {
    throw new Error('Mock flight service failed.');
  }

  const results = searchFlights(query, mockFlights, options);

  if (results.length > 0) {
    return priceForPassengerCount(results, query.adults);
  }

  return priceForPassengerCount(
    searchFlights(query, createReversedMockFlights(query), options),
    query.adults,
  );
}

function priceForPassengerCount(flights, passengerCountValue) {
  const passengerCount = Number(passengerCountValue);

  return flights.map((flight) => {
    const basePassengerCount = Number(flight.price?.passengerCount) || 1;
    const pricePerAdult = Number(flight.price?.amount ?? 0) / basePassengerCount;
    const amount = pricePerAdult * passengerCount;
    const currency = flight.price?.currency ?? 'USD';

    return {
      ...flight,
      price: {
        ...flight.price,
        amount,
        display: formatPrice(amount, currency),
        passengerCount,
      },
    };
  });
}

function formatPrice(amount, currency) {
  return currency === 'USD' ? `$${amount}` : `${amount} ${currency}`;
}

function wait(delayMs) {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}

function createReversedMockFlights(query) {
  const departureDate = query.dateRange?.start || query.departureDate;

  return mockFlights.map((flight) => ({
    ...flight,
    id: `${flight.id}-reverse`,
    route: {
      origin: flight.route.destination,
      stopover: flight.route.stopover,
      destination: flight.route.origin,
      departureDate,
    },
    segments: reverseSegments(flight.segments, departureDate),
  }));
}

function reverseSegments(segments, departureDate) {
  return [...segments].reverse().map((segment, index) => ({
    ...segment,
    from: segment.to,
    to: segment.from,
    departure: createMockDateTime(departureDate, index === 0 ? '10:00' : '18:00'),
    arrival: createMockDateTime(departureDate, index === 0 ? '14:00' : '22:00'),
  }));
}

function createMockDateTime(date, time) {
  return `${date} ${time}`;
}
