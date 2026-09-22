import { findAirportById, resolveAirport } from '../services/airportMetadataService.js';
import { isDateAfterToday, parseDateOnly } from './dateTime.js';

export function validateSearchQuery(query, { currentDate = new Date() } = {}) {
  const errors = {};

  if (!hasText(query?.from)) {
    errors.from = 'From is required.';
  }

  if (!hasText(query?.to)) {
    errors.to = 'To is required.';
  }

  if (!errors.from && !resolveRouteAirport(query, 'from')) {
    errors.from = 'Choose a supported From airport.';
  }

  if (hasText(query?.via) && !resolveRouteAirport(query, 'via')) {
    errors.via = 'Choose a supported Via airport.';
  }

  if (!errors.to && !resolveRouteAirport(query, 'to')) {
    errors.to = 'Choose a supported To airport.';
  }

  if (!hasText(query?.dateRange?.start) || !hasText(query?.dateRange?.end)) {
    errors.dateRange = 'Date Range is required.';
  }

  if (isRoundTrip(query) && (!hasText(query?.returnDateRange?.start) || !hasText(query?.returnDateRange?.end))) {
    errors.returnDateRange = 'Return Date Range is required for round trips.';
  }

  if (!hasText(query?.adults)) {
    errors.adults = 'Adults is required.';
  }

  if (!hasText(query?.minLayover)) {
    errors.minLayover = 'Min Layover Hours is required.';
  }

  if (!hasText(query?.maxLayover)) {
    errors.maxLayover = 'Max Layover Hours is required.';
  }

  if (!errors.from && !errors.via && !errors.to && hasDuplicateRoutePoint(query)) {
    errors.route = 'From, Via, and To must be different.';
  }

  if (!errors.adults && Number(query.adults) < 1) {
    errors.adults = 'Adults must be at least 1.';
  }

  if (!errors.dateRange && (!parseDateOnly(query.dateRange.start) || !parseDateOnly(query.dateRange.end))) {
    errors.dateRange = 'Date Range must use valid dates.';
  }

  if (!errors.returnDateRange && isRoundTrip(query) && (!parseDateOnly(query.returnDateRange.start) || !parseDateOnly(query.returnDateRange.end))) {
    errors.returnDateRange = 'Return Date Range must use valid dates.';
  }

  if (!errors.dateRange && query.dateRange.start > query.dateRange.end) {
    errors.dateRange = 'Date Range start date must be before or equal to end date.';
  }

  if (!errors.dateRange && !isDateAfterToday(query.dateRange.start, currentDate)) {
    errors.dateRange = 'Departure Date Start must be after today.';
  }

  if (!errors.returnDateRange && isRoundTrip(query) && query.returnDateRange.start > query.returnDateRange.end) {
    errors.returnDateRange = 'Return Date Range start date must be before or equal to end date.';
  }

  if (!errors.dateRange && !errors.returnDateRange && isRoundTrip(query) && query.returnDateRange.start < query.dateRange.end) {
    errors.returnDateRange = 'Return Date Start cannot be earlier than Departure Date End.';
  }

  if (!errors.minLayover && !errors.maxLayover && Number(query.minLayover) > Number(query.maxLayover)) {
    errors.layover = 'Min Layover Hours cannot be greater than Max Layover Hours.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

function hasText(value) {
  return String(value ?? '').trim().length > 0;
}

function isRoundTrip(query) {
  return query?.tripType === 'roundTrip';
}

function hasDuplicateRoutePoint(query) {
  const routePoints = ['from', 'via', 'to']
    .map((fieldName) => query?.[`${fieldName}AirportId`] || query?.[fieldName])
    .map((value) => String(value ?? '').trim().toLowerCase())
    .filter(Boolean);

  return new Set(routePoints).size !== routePoints.length;
}

function resolveRouteAirport(query, fieldName) {
  return findAirportById(query?.[`${fieldName}AirportId`]) ?? resolveAirport(query?.[fieldName]);
}
