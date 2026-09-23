import { isFlightTimingValid } from './dateTime.js';
import {
  findAirportById,
  findRouteLocationById,
  resolveAirport,
  resolveRouteLocation,
} from '../services/airportMetadataService.js';

export function searchFlights(query, flights, options = {}) {
  const fromAirport = resolveQueryAirport(query, 'from');
  const viaAirport = resolveQueryAirport(query, 'via');
  const toAirport = resolveQueryAirport(query, 'to');

  return flights.filter((flight) => {
    const isDirect = !flight.route.stopover || flight.segments?.length === 1;
    const connectionPreference = query.connectionPreference ?? (viaAirport || hasText(query.via) ? 'via' : 'all');

    return (
      matchesRoutePoint(flight.route.origin, fromAirport, query.from) &&
      matchesConnection(flight, isDirect, connectionPreference, viaAirport, query.via) &&
      matchesRoutePoint(flight.route.destination, toAirport, query.to) &&
      flight.route.departureDate >= query.dateRange.start &&
      flight.route.departureDate <= query.dateRange.end &&
      Number(flight.availability.seats) >= Number(query.adults) &&
      (isDirect || Number(flight.duration.layoverMinutes) >= Number(query.minLayover) * 60) &&
      (isDirect || Number(flight.duration.layoverMinutes) <= Number(query.maxLayover) * 60) &&
      isFlightTimingValid(flight, options)
    );
  });
}

function matchesConnection(flight, isDirect, preference, viaAirport, fallbackValue) {
  if (preference === 'direct') {
    return isDirect;
  }

  if (preference === 'via') {
    return !isDirect && matchesRoutePoint(flight.route.stopover, viaAirport, fallbackValue);
  }

  return true;
}

function resolveQueryAirport(query, fieldName) {
  if (fieldName === 'via') {
    return findAirportById(query?.viaAirportId) ?? resolveAirport(query?.via);
  }

  return findRouteLocationById(query?.[`${fieldName}AirportId`]) ?? resolveRouteLocation(query?.[fieldName]);
}

function matchesRoutePoint(routePoint, airport, fallbackValue) {
  if (airport) {
    if (airport.kind === 'city') {
      return airport.iataCodes.some((iata) => normalize(routePoint?.code) === normalize(iata));
    }

    return normalize(routePoint?.code) === normalize(airport.iata);
  }

  return normalize(routePoint?.city) === normalize(fallbackValue);
}

function hasText(value) {
  return String(value ?? '').trim().length > 0;
}

function normalize(value) {
  return String(value ?? '').trim().toLowerCase();
}
