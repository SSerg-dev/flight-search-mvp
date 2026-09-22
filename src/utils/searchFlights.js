import { isFlightTimingValid } from './dateTime.js';
import { findAirportById, resolveAirport } from '../services/airportMetadataService.js';

export function searchFlights(query, flights, options = {}) {
  const fromAirport = resolveQueryAirport(query, 'from');
  const viaAirport = resolveQueryAirport(query, 'via');
  const toAirport = resolveQueryAirport(query, 'to');

  return flights.filter((flight) => {
    return (
      matchesRoutePoint(flight.route.origin, fromAirport, query.from) &&
      (!viaAirport && !hasText(query.via) || matchesRoutePoint(flight.route.stopover, viaAirport, query.via)) &&
      matchesRoutePoint(flight.route.destination, toAirport, query.to) &&
      flight.route.departureDate >= query.dateRange.start &&
      flight.route.departureDate <= query.dateRange.end &&
      Number(flight.availability.seats) >= Number(query.adults) &&
      Number(flight.duration.layoverMinutes) >= Number(query.minLayover) * 60 &&
      Number(flight.duration.layoverMinutes) <= Number(query.maxLayover) * 60 &&
      isFlightTimingValid(flight, options)
    );
  });
}

function resolveQueryAirport(query, fieldName) {
  return findAirportById(query?.[`${fieldName}AirportId`]) ?? resolveAirport(query?.[fieldName]);
}

function matchesRoutePoint(routePoint, airport, fallbackValue) {
  if (airport) {
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
