export function normalizeDuffelOfferRequest(response, { query } = {}) {
  const offers = Array.isArray(response?.data?.offers) ? response.data.offers : [];

  return offers.map((offer) => normalizeOffer(offer, query));
}

function normalizeOffer(offer, query = {}) {
  const segments = offer?.slices?.[0]?.segments;

  if (!Array.isArray(segments) || segments.length < 2) {
    throw new Error('Duffel offer is missing itinerary segments.');
  }

  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1];
  const stopoverSegment = segments[1];
  const carrier = firstSegment.marketing_carrier ?? {};
  const passengerCount = getPassengerCount(offer, query);
  const layoverMinutes = getLayoverMinutes(firstSegment, stopoverSegment);
  const totalMinutes = getTotalMinutes(firstSegment, lastSegment);

  return {
    id: String(offer.id ?? createFallbackId(firstSegment, lastSegment)),
    airline: {
      name: String(carrier.name ?? 'Unknown airline'),
      code: String(carrier.iata_code ?? ''),
      flightNumbers: segments.map((segment) => getFlightNumber(segment)),
    },
    price: getPrice(offer, passengerCount),
    route: {
      origin: getRoutePoint(firstSegment.origin, query.from),
      stopover: getRoutePoint(firstSegment.destination, query.via),
      destination: getRoutePoint(lastSegment.destination, query.to),
      departureDate: getDate(firstSegment.departing_at),
    },
    segments: segments.map(normalizeSegment),
    duration: {
      totalMinutes,
      display: formatDuration(totalMinutes),
      layoverMinutes,
      layoverDisplay: `${formatHours(layoverMinutes)} layover`,
    },
    availability: {
      seats: passengerCount,
      canBookAdults: passengerCount >= Number(query.adults ?? 1),
    },
  };
}

function normalizeSegment(segment) {
  return {
    from: getRoutePoint(segment.origin).city,
    to: getRoutePoint(segment.destination).city,
    departure: formatDateTime(segment.departing_at),
    arrival: formatDateTime(segment.arriving_at),
    flightNumber: getFlightNumber(segment),
  };
}

function getRoutePoint(place = {}, fallbackCity = '') {
  return {
    city: String(place.city_name ?? fallbackCity ?? place.iata_code ?? ''),
    airport: String(place.name ?? ''),
    code: String(place.iata_code ?? ''),
  };
}

function getFlightNumber(segment) {
  return `${segment.marketing_carrier?.iata_code ?? ''}${segment.marketing_carrier_flight_number ?? ''}`;
}

function getPrice(offer, passengerCount) {
  const currency = String(offer.total_currency ?? 'USD');
  const amount = Number(offer.total_amount ?? 0);

  return {
    amount,
    currency,
    display: formatPrice(amount, currency),
    passengerCount,
  };
}

function getPassengerCount(offer, query = {}) {
  const passengers = offer?.passengers?.length;

  if (Number.isFinite(passengers) && passengers > 0) {
    return passengers;
  }

  return Number(query.adults ?? 1);
}

function getLayoverMinutes(firstSegment, secondSegment) {
  const firstArrival = Date.parse(firstSegment.arriving_at ?? '');
  const secondDeparture = Date.parse(secondSegment.departing_at ?? '');

  if (!Number.isFinite(firstArrival) || !Number.isFinite(secondDeparture)) {
    return 0;
  }

  return Math.max(0, Math.round((secondDeparture - firstArrival) / 60000));
}

function getTotalMinutes(firstSegment, lastSegment) {
  const departure = Date.parse(firstSegment.departing_at ?? '');
  const arrival = Date.parse(lastSegment.arriving_at ?? '');

  if (!Number.isFinite(departure) || !Number.isFinite(arrival)) {
    return 0;
  }

  return Math.max(0, Math.round((arrival - departure) / 60000));
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

function formatHours(totalMinutes) {
  if (!Number.isFinite(totalMinutes) || totalMinutes <= 0) {
    return '0h';
  }

  const hours = totalMinutes / 60;

  if (Number.isInteger(hours)) {
    return `${hours}h`;
  }

  return `${Number(hours.toFixed(2))}h`;
}

function formatPrice(amount, currency) {
  if (currency === 'USD') {
    return `$${amount}`;
  }

  return `${amount} ${currency}`;
}

function formatDateTime(value) {
  const [date = '', time = ''] = String(value ?? '').split('T');

  return `${date} ${time.slice(0, 5)}`.trim();
}

function getDate(value) {
  return String(value ?? '').split('T')[0] ?? '';
}

function createFallbackId(firstSegment, lastSegment) {
  return [
    firstSegment.origin?.iata_code,
    firstSegment.destination?.iata_code,
    lastSegment.destination?.iata_code,
    firstSegment.departing_at,
  ]
    .filter(Boolean)
    .join('-');
}
