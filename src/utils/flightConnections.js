import { findAirportById, findAirportByIata, resolveAirport } from '../services/airportMetadataService.js';

export const CONNECTION_PREFERENCES = {
  ALL: 'all',
  DIRECT: 'direct',
  VIA: 'via',
};

export function getAvailableConnectionOptions(results) {
  const flightLists = getFlightLists(results);

  if (flightLists.length === 0) {
    return [];
  }

  const optionSets = flightLists.map(createOptionMap);
  const [firstOptions, ...remainingOptions] = optionSets;
  const sharedOptions = [...firstOptions.values()].filter((option) =>
    remainingOptions.every((options) => options.has(option.key)),
  );

  return sharedOptions.sort(compareConnectionOptions);
}

export function filterFlightResultsByConnection(results, query = {}) {
  if (Array.isArray(results)) {
    return filterFlightsByConnection(results, query);
  }

  if (Array.isArray(results?.outbound) && Array.isArray(results?.return)) {
    return {
      outbound: filterFlightsByConnection(results.outbound, query),
      return: filterFlightsByConnection(results.return, query),
    };
  }

  return results;
}

export function groupFlightsByConnection(flights = []) {
  const groups = new Map();

  flights.forEach((flight) => {
    const option = createConnectionOption(flight);
    const group = groups.get(option.key) ?? { ...option, flights: [] };

    group.flights.push(flight);
    groups.set(option.key, group);
  });

  return [...groups.values()].sort(compareConnectionOptions);
}

function getFlightLists(results) {
  if (Array.isArray(results)) {
    return [results];
  }

  if (Array.isArray(results?.outbound) && Array.isArray(results?.return)) {
    return [results.outbound, results.return];
  }

  return [];
}

function createOptionMap(flights) {
  const options = new Map();

  flights.forEach((flight) => {
    const option = createConnectionOption(flight);
    options.set(option.key, option);
  });

  return options;
}

function createConnectionOption(flight) {
  const stopoverCode = String(flight?.route?.stopover?.code ?? '').trim().toUpperCase();

  if (!stopoverCode || flight?.segments?.length === 1) {
    return {
      key: CONNECTION_PREFERENCES.DIRECT,
      type: CONNECTION_PREFERENCES.DIRECT,
      label: 'Direct flight',
      code: '',
      airportId: '',
    };
  }

  const airport = findAirportByIata(stopoverCode);
  const city = airport?.city || flight?.route?.stopover?.city || stopoverCode;
  const name = airport?.name || flight?.route?.stopover?.airport || city;

  return {
    key: `via:${stopoverCode}`,
    type: CONNECTION_PREFERENCES.VIA,
    label: `${stopoverCode} — ${name}, ${city}`,
    code: stopoverCode,
    airportId: airport?.id ?? '',
  };
}

function filterFlightsByConnection(flights, query) {
  const preference = getConnectionPreference(query);
  const requestedCode = getRequestedStopoverCode(query);

  return flights.filter((flight) => {
    const isDirect = !flight?.route?.stopover?.code || flight?.segments?.length === 1;

    if (preference === CONNECTION_PREFERENCES.DIRECT) {
      return isDirect;
    }

    if (preference === CONNECTION_PREFERENCES.VIA) {
      return !isDirect && String(flight.route.stopover.code).toUpperCase() === requestedCode;
    }

    return true;
  });
}

function getConnectionPreference(query) {
  if (Object.values(CONNECTION_PREFERENCES).includes(query?.connectionPreference)) {
    return query.connectionPreference;
  }

  return String(query?.via ?? '').trim() ? CONNECTION_PREFERENCES.VIA : CONNECTION_PREFERENCES.ALL;
}

function getRequestedStopoverCode(query) {
  const airport = findAirportById(query?.viaAirportId) ?? resolveAirport(query?.via);

  return String(airport?.iata ?? query?.via ?? '').trim().toUpperCase();
}

function compareConnectionOptions(left, right) {
  if (left.type === CONNECTION_PREFERENCES.DIRECT && right.type !== CONNECTION_PREFERENCES.DIRECT) return -1;
  if (right.type === CONNECTION_PREFERENCES.DIRECT && left.type !== CONNECTION_PREFERENCES.DIRECT) return 1;

  return left.label.localeCompare(right.label);
}
