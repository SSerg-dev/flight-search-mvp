import { mockFlights } from '../../data/mockFlights.js';
import { searchFlights } from '../../utils/searchFlights.js';
import { parseDateOnly, parseFlightDateTime } from '../../utils/dateTime.js';
import { getSearchDayCount, MAX_SEARCH_DAYS } from '../../utils/searchDateRange.js';

const DEFAULT_DELAY_MS = 150;

export async function searchMockFlightOffers(query, { delayMs = DEFAULT_DELAY_MS, shouldFail = false, ...options } = {}) {
  await wait(delayMs);

  if (shouldFail) {
    throw new Error('Mock flight service failed.');
  }

  return priceForPassengerCount(
    searchFlights(query, createDatedMockFlights(query), options),
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
        perAdultAmount: pricePerAdult,
        perAdultDisplay: formatPrice(pricePerAdult, currency),
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

function createDatedMockFlights(query) {
  const dayCount = getSearchDayCount(query.dateRange);
  if (!dayCount || dayCount > MAX_SEARCH_DAYS) return [];
  const start = parseDateOnly(query.dateRange.start);
  const flights = [];
  for (let day = 0; day < dayCount; day += 1) {
    const date = new Date(start.getTime() + day * 86400000);
    const departureDate = date.toISOString().slice(0, 10);
    for (const template of mockFlights) {
      const offset = date - parseDateOnly(template.route.departureDate);
      const segments = template.segments.map((segment) => ({
        ...segment,
        departure: formatDateTime(new Date(parseFlightDateTime(segment.departure).getTime() + offset)),
        arrival: formatDateTime(new Date(parseFlightDateTime(segment.arrival).getTime() + offset)),
      }));
      const flight = {
        ...template,
        id: `${template.id}-${departureDate}`,
        route: { ...template.route, departureDate },
        segments,
      };
      flights.push(flight, reverseFlight(flight));
    }
  }
  return flights;
}

function reverseFlight(flight) {
  let cursor = parseFlightDateTime(flight.segments[0].departure).getTime();
  const segments = [...flight.segments].reverse().map((segment, index) => {
    if (index > 0) cursor += flight.duration.layoverMinutes * 60000;
    const departure = formatDateTime(new Date(cursor));
    cursor += parseFlightDateTime(segment.arrival) - parseFlightDateTime(segment.departure);
    return { ...segment, from: segment.to, to: segment.from, departure, arrival: formatDateTime(new Date(cursor)) };
  });
  return {
    ...flight,
    id: `${flight.id}-reverse`,
    airline: { ...flight.airline, flightNumbers: [...flight.airline.flightNumbers].reverse() },
    route: { ...flight.route, origin: flight.route.destination, destination: flight.route.origin },
    segments,
  };
}

function formatDateTime(date) {
  return date.toISOString().slice(0, 16).replace('T', ' ');
}
