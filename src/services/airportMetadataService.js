import { airports } from '../data/airports.js';

const airportById = new Map(airports.map((airport) => [airport.id, airport]));
const airportByIata = new Map(airports.map((airport) => [airport.iata, airport]));
const cityLocations = createCityLocations();
const cityLocationById = new Map(cityLocations.map((location) => [location.id, location]));
const russianRegionNames = createRussianRegionNames();
const airportSearchIndex = airports.map((airport, sourceIndex) => ({
  airport,
  sourceIndex,
  iata: normalizeSearchText(airport.iata),
  city: normalizeSearchText(airport.city),
  name: normalizeSearchText(airport.name),
  searchable: normalizeSearchText(
    [
      airport.iata,
      airport.icao,
      airport.name,
      airport.city,
      airport.country,
      airport.countryCode,
      russianRegionNames.of(airport.countryCode),
      ...airport.aliases,
    ].join(' '),
  ),
}));
const citySearchIndex = cityLocations.map((location, sourceIndex) => ({
  location,
  sourceIndex,
  city: normalizeSearchText(location.city),
  searchable: normalizeSearchText(
    [
      location.city,
      location.country,
      location.countryCode,
      russianRegionNames.of(location.countryCode),
      ...location.iataCodes,
      ...location.aliases,
    ].join(' '),
  ),
}));

export function findAirportById(id) {
  return airportById.get(String(id ?? '').trim()) ?? null;
}

export function findAirportByIata(iata) {
  return airportByIata.get(String(iata ?? '').trim().toUpperCase()) ?? null;
}

export function findRouteLocationById(id) {
  const normalizedId = String(id ?? '').trim();

  return cityLocationById.get(normalizedId) ?? findAirportById(normalizedId);
}

export function resolveAirport(value) {
  if (value && typeof value === 'object') {
    return findAirportById(value.id) ?? findAirportByIata(value.iata);
  }

  const text = String(value ?? '').trim();

  return (
    findAirportById(text) ??
    findAirportByIata(getIataFromSelection(text)) ??
    getUnambiguousSearchResult(text)
  );
}

export function resolveRouteLocation(value) {
  if (value && typeof value === 'object') {
    return findRouteLocationById(value.id) ?? resolveAirport(value);
  }

  const text = String(value ?? '').trim();
  const cityMatches = cityLocations.filter((location) => location.city.toLowerCase() === text.toLowerCase());

  return findRouteLocationById(text) ?? (cityMatches.length === 1 ? cityMatches[0] : null) ?? resolveAirport(text);
}

export function searchAirports(query, { limit = 10 } = {}) {
  const normalizedQuery = expandLocalizedQuery(normalizeSearchText(query));
  const resultLimit = Math.max(0, Number(limit) || 0);

  if (!normalizedQuery || resultLimit === 0) {
    return [];
  }

  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);

  return airportSearchIndex
    .filter((entry) => queryTokens.every((token) => entry.searchable.includes(token)))
    .map((entry) => ({ ...entry, score: getSearchScore(entry, normalizedQuery) }))
    .sort((left, right) => left.score - right.score || left.sourceIndex - right.sourceIndex)
    .slice(0, resultLimit)
    .map((entry) => entry.airport);
}

export function searchRouteLocations(query, { limit = 10 } = {}) {
  const normalizedQuery = expandLocalizedQuery(normalizeSearchText(query));
  const resultLimit = Math.max(0, Number(limit) || 0);

  if (!normalizedQuery || resultLimit === 0) {
    return [];
  }

  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);
  const cityResults = citySearchIndex
    .filter((entry) => queryTokens.every((token) => entry.searchable.includes(token)))
    .map((entry) => ({
      value: entry.location,
      score: entry.city === normalizedQuery ? 0 : entry.city.startsWith(normalizedQuery) ? 2 : 5,
      sourceIndex: entry.sourceIndex,
    }));
  const airportResults = airportSearchIndex
    .filter((entry) => queryTokens.every((token) => entry.searchable.includes(token)))
    .map((entry) => ({
      value: entry.airport,
      score: getSearchScore(entry, normalizedQuery) + 1,
      sourceIndex: cityLocations.length + entry.sourceIndex,
    }));

  return [...cityResults, ...airportResults]
    .sort((left, right) => left.score - right.score || left.sourceIndex - right.sourceIndex)
    .slice(0, resultLimit)
    .map((entry) => entry.value);
}

function expandLocalizedQuery(query) {
  const localizedQueries = new Map([
    ['москва moskva', 'moscow moscow'],
    ['санкт петербург sankt peterburg', 'saint petersburg saint petersburg'],
    ['петербург peterburg', 'petersburg petersburg'],
    ['стамбул stambul', 'istanbul istanbul'],
    ['лондон london', 'london london'],
    ['бостон boston', 'boston boston'],
  ]);

  return localizedQueries.get(query) ?? query;
}

export function formatAirportOptionValue(airport) {
  if (!airport) {
    return '';
  }

  return `${airport.iata} — ${airport.name}, ${airport.city}, ${airport.country}`;
}

export function formatRouteLocationOptionValue(location) {
  if (!location) {
    return '';
  }

  if (location.kind === 'city') {
    return `${location.city} — All airports (${location.iataCodes.join(', ')}), ${location.country}`;
  }

  return formatAirportOptionValue(location);
}

export function getRouteLocationIata(location) {
  if (location?.kind === 'city') {
    return location.iataCodes.join(',');
  }

  return String(location?.iata ?? '').trim().toUpperCase();
}

function getUnambiguousSearchResult(value) {
  return searchAirports(value, { limit: 1 })[0] ?? null;
}

function getSearchScore(entry, query) {
  if (entry.iata === query) return 0;
  if (entry.city === query) return 1;
  if (entry.iata.startsWith(query)) return 2;
  if (entry.city.startsWith(query)) return 3;
  if (entry.name.startsWith(query)) return 4;

  return 5;
}

function normalizeSearchText(value) {
  const normalized = String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[‐‑‒–—−]/g, '-')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();

  return `${normalized} ${transliterateCyrillic(normalized)}`.trim();
}

function transliterateCyrillic(value) {
  const characters = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y',
    к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f',
    х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
  };

  return [...String(value)].map((character) => characters[character] ?? character).join('');
}

function getIataFromSelection(value) {
  const text = String(value ?? '').trim();
  const leadingMatch = /^([A-Z0-9]{3})(?:\s|—|-|$)/i.exec(text);
  const delimitedMatch = /(?:^|\s[-—]\s)([A-Z0-9]{3})(?:\s[-—]\s|$)/i.exec(text);

  return leadingMatch?.[1]?.toUpperCase() ?? delimitedMatch?.[1]?.toUpperCase() ?? '';
}

function createRussianRegionNames() {
  try {
    return new Intl.DisplayNames(['ru'], { type: 'region' });
  } catch {
    return { of: () => '' };
  }
}

function createCityLocations() {
  const groupedAirports = new Map();

  airports
    .filter((airport) => ['large_airport', 'medium_airport'].includes(airport.type))
    .forEach((airport) => {
      const city = String(airport.city ?? '').trim();
      const countryCode = String(airport.countryCode ?? '').trim().toUpperCase();

      if (!city || !countryCode) return;

      const key = `${countryCode}:${city.toLocaleLowerCase('en')}`;
      const group = groupedAirports.get(key) ?? [];
      group.push(airport);
      groupedAirports.set(key, group);
    });

  return [...groupedAirports.values()]
    .filter((group) => group.length >= 2)
    .map((group) => {
      const sortedAirports = [...group].sort((left, right) => left.iata.localeCompare(right.iata));
      const [firstAirport] = sortedAirports;

      return {
        id: `city:${firstAirport.countryCode.toLowerCase()}:${slugify(firstAirport.city)}`,
        kind: 'city',
        name: 'All airports',
        city: firstAirport.city,
        country: firstAirport.country,
        countryCode: firstAirport.countryCode,
        iataCodes: sortedAirports.map((airport) => airport.iata),
        airportIds: sortedAirports.map((airport) => airport.id),
        aliases: [...new Set(sortedAirports.flatMap((airport) => airport.aliases ?? []))],
      };
    });
}

function slugify(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
