import { airports } from '../data/airports.js';

export function findAirportByIata(iata) {
  const normalizedCode = normalizeSearchText(iata);

  if (!normalizedCode) {
    return null;
  }

  return airports.find((airport) => normalizeSearchText(airport.iata) === normalizedCode) ?? null;
}

export function searchAirports(query, { limit = 10 } = {}) {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return [];
  }

  return airports
    .filter((airport) => getSearchTokens(airport).some((token) => token.includes(normalizedQuery)))
    .slice(0, Math.max(0, Number(limit) || 0));
}

function getSearchTokens(airport) {
  return [
    airport.iata,
    airport.name,
    airport.city,
    airport.country,
    ...airport.aliases,
  ].map(normalizeSearchText);
}

function normalizeSearchText(value) {
  return String(value ?? '').trim().toLowerCase();
}
