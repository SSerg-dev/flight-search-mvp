import { isFlightTimingValid } from '../../utils/dateTime.js';
import { resolveAirport } from '../airportMetadataService.js';

export function normalizeSerpApiFlightResults(response, { query, currentDate = new Date() } = {}) {
  const results = [...getArray(response?.best_flights), ...getArray(response?.other_flights)];
  const stopoverCode = getKnownAirportCode(query?.viaAirportId || query?.via);

  return results
    .filter((result) => hasRequestedStopover(result, stopoverCode))
    .map((result) => normalizeResult(result, query))
    .filter((flight) => isFlightTimingValid(flight, { currentDate }));
}

function normalizeResult(result, query = {}) {
  const flights = getArray(result?.flights);

  if (flights.length < 1) {
    throw new Error('SerpApi flight result is missing itinerary segments.');
  }

  if (!flights.every(hasCompleteFlightTiming)) {
    throw new Error('SerpApi flight result is missing itinerary segments.');
  }

  const firstFlight = flights[0];
  const lastFlight = flights[flights.length - 1];
  const stopover = getStopover(result, firstFlight);
  const passengerCount = Number(query.adults ?? 1);
  const flightNumbers = flights.map((flight) => formatFlightNumber(flight.flight_number));
  const airlineName = String(firstFlight.airline ?? 'Unknown airline');
  const airlineCode = getAirlineCode(flightNumbers[0]);
  const layoverMinutes = getArray(result?.layovers).reduce((total, layover) => total + Number(layover?.duration ?? 0), 0);
  const totalMinutes = Number(result.total_duration ?? getTotalMinutes(flights, layoverMinutes));
  const priceAmount = Number(result.price ?? 0);

  return {
    id: createId(flights, flightNumbers),
    airline: {
      name: airlineName,
      code: airlineCode,
      flightNumbers,
    },
    price: {
      amount: priceAmount,
      currency: 'USD',
      display: formatPrice(priceAmount, 'USD'),
      passengerCount,
    },
    route: {
      origin: getRoutePoint(firstFlight.departure_airport, query.from),
      stopover: hasText(stopover?.id) ? getRoutePoint(stopover, query.via) : null,
      destination: getRoutePoint(lastFlight.arrival_airport, query.to),
      departureDate: getDate(firstFlight.departure_airport?.time),
    },
    segments: flights.map((flight) => normalizeSegment(flight)),
    duration: {
      totalMinutes,
      display: formatDuration(totalMinutes),
      layoverMinutes,
      layoverDisplay: `${formatDuration(layoverMinutes)} layover`,
    },
    availability: {
      seats: passengerCount,
      canBookAdults: true,
    },
  };
}

function normalizeSegment(flight) {
  const fromPoint = getRoutePoint(flight.departure_airport);
  const toPoint = getRoutePoint(flight.arrival_airport);

  return {
    from: fromPoint.city,
    to: toPoint.city,
    departure: formatDateTime(flight.departure_airport?.time),
    arrival: formatDateTime(flight.arrival_airport?.time),
    flightNumber: formatFlightNumber(flight.flight_number),
  };
}

function hasCompleteFlightTiming(flight) {
  return (
    hasText(flight?.departure_airport?.id) &&
    hasText(flight?.departure_airport?.time) &&
    hasText(flight?.arrival_airport?.id) &&
    hasText(flight?.arrival_airport?.time)
  );
}

function hasRequestedStopover(result, stopoverCode) {
  const layovers = getArray(result?.layovers);

  if (!hasText(stopoverCode)) {
    return getArray(result?.flights).length >= 1;
  }

  if (getArray(result?.flights).length !== 2 || layovers.length !== 1) {
    return false;
  }

  return String(layovers[0]?.id ?? '').toUpperCase() === stopoverCode;
}

function getStopover(result, firstFlight) {
  return getArray(result?.layovers)[0] ?? {};
}

function getRoutePoint(point = {}, fallbackCity = '') {
  const code = String(point?.id ?? '');

  return {
    city: getCityName(code, point?.name, fallbackCity),
    airport: String(point?.name ?? ''),
    code,
  };
}

function getCityName(code, name, fallbackCity) {
  const knownCities = {
    BOS: 'Boston',
    IST: 'Istanbul',
    LED: 'Saint Petersburg',
  };

  return knownCities[code] ?? String(fallbackCity || name || code);
}

function getKnownAirportCode(value) {
  const airport = resolveAirport(value);

  return airport?.iata ?? String(value ?? '').trim().toUpperCase();
}

function getAirlineCode(flightNumber) {
  return String(flightNumber ?? '').match(/^[A-Z0-9]{2}/)?.[0] ?? '';
}

function formatFlightNumber(value) {
  const match = String(value ?? '')
    .trim()
    .toUpperCase()
    .match(/^([A-Z0-9]{2})\s*0*(\d+)$/);

  if (!match) {
    return String(value ?? '').replace(/\s+/g, '');
  }

  return `${match[1]}${match[2]}`;
}

function getTotalMinutes(flights, layoverMinutes) {
  return flights.reduce((total, flight) => total + Number(flight.duration ?? 0), layoverMinutes);
}

function formatDuration(totalMinutes) {
  if (!Number.isFinite(totalMinutes) || totalMinutes <= 0) {
    return '';
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
}

function formatPrice(amount, currency) {
  if (currency === 'USD') {
    return `$${amount}`;
  }

  return `${amount} ${currency}`;
}

function formatDateTime(value) {
  return String(value ?? '').trim();
}

function getDate(value) {
  return String(value ?? '').split(' ')[0] ?? '';
}

function createId(flights, flightNumbers) {
  const firstFlight = flights[0];
  const lastFlight = flights[flights.length - 1];

  return [
    'serpapi',
    firstFlight.departure_airport?.id,
    firstFlight.arrival_airport?.id,
    lastFlight.arrival_airport?.id,
    firstFlight.departure_airport?.time,
    flightNumbers.join('-'),
  ]
    .filter(Boolean)
    .join('-');
}

function getArray(value) {
  return Array.isArray(value) ? value : [];
}

function hasText(value) {
  return String(value ?? '').trim().length > 0;
}
