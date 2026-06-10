export function normalizeAmadeusFlightOffers(response, { query } = {}) {
  const offers = Array.isArray(response?.data) ? response.data : [];

  return offers.map((offer) => normalizeOffer(offer, response?.dictionaries ?? {}, query));
}

function normalizeOffer(offer, dictionaries, query = {}) {
  const segments = offer?.itineraries?.[0]?.segments;

  if (!Array.isArray(segments) || segments.length < 2) {
    throw new Error('Amadeus flight offer is missing itinerary segments.');
  }

  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1];
  const stopoverSegment = segments[1];
  const airlineCode = String(firstSegment.carrierCode ?? '');
  const airlineName = dictionaries.carriers?.[airlineCode] ?? 'Unknown airline';
  const passengerCount = getPassengerCount(offer, query);
  const price = getPrice(offer, passengerCount);
  const normalizedSegments = segments.map((segment) => normalizeSegment(segment, dictionaries, query));
  const layoverMinutes = getLayoverMinutes(firstSegment, stopoverSegment);

  return {
    id: String(offer.id ?? createFallbackId(firstSegment, lastSegment)),
    airline: {
      name: airlineName,
      code: airlineCode,
      flightNumbers: segments.map((segment) => `${segment.carrierCode ?? ''}${segment.number ?? ''}`),
    },
    price,
    route: {
      origin: getRoutePoint(firstSegment.departure?.iataCode, dictionaries, query.from),
      stopover: getRoutePoint(firstSegment.arrival?.iataCode, dictionaries, query.via),
      destination: getRoutePoint(lastSegment.arrival?.iataCode, dictionaries, query.to),
      departureDate: getDate(firstSegment.departure?.at),
    },
    segments: normalizedSegments,
    duration: {
      totalMinutes: parseIsoDuration(offer.itineraries[0].duration),
      display: formatDuration(parseIsoDuration(offer.itineraries[0].duration)),
      layoverMinutes,
      layoverDisplay: `${formatHours(layoverMinutes)} layover`,
    },
    availability: {
      seats: Number(offer.numberOfBookableSeats ?? passengerCount),
      canBookAdults: Number(offer.numberOfBookableSeats ?? passengerCount) >= passengerCount,
    },
  };
}

function normalizeSegment(segment, dictionaries, query) {
  const fromPoint = getRoutePoint(segment.departure?.iataCode, dictionaries, query?.from);
  const toPoint = getRoutePoint(segment.arrival?.iataCode, dictionaries, query?.to);

  return {
    from: fromPoint.city,
    to: toPoint.city,
    departure: formatDateTime(segment.departure?.at),
    arrival: formatDateTime(segment.arrival?.at),
    flightNumber: `${segment.carrierCode ?? ''}${segment.number ?? ''}`,
  };
}

function getRoutePoint(code, dictionaries, fallbackCity = '') {
  const value = String(code ?? '');
  const location = dictionaries.locations?.[value];

  return {
    city: getCityName(value, fallbackCity),
    airport: String(location?.detailedName ?? ''),
    code: value,
  };
}

function getCityName(code, fallbackCity) {
  const knownCities = {
    BOS: 'Boston',
    IST: 'Istanbul',
    LED: 'Saint Petersburg',
  };

  return knownCities[code] ?? String(fallbackCity ?? code);
}

function getPrice(offer, passengerCount) {
  const currency = String(offer?.price?.currency ?? 'USD');
  const amount = Number(offer?.price?.grandTotal ?? 0);

  return {
    amount,
    currency,
    display: formatPrice(amount, currency),
    passengerCount,
  };
}

function getPassengerCount(offer, query = {}) {
  const travelerCount = offer?.travelerPricings?.length;

  if (Number.isFinite(travelerCount) && travelerCount > 0) {
    return travelerCount;
  }

  return Number(query.adults ?? 1);
}

function getLayoverMinutes(firstSegment, secondSegment) {
  const firstArrival = Date.parse(firstSegment.arrival?.at ?? '');
  const secondDeparture = Date.parse(secondSegment.departure?.at ?? '');

  if (!Number.isFinite(firstArrival) || !Number.isFinite(secondDeparture)) {
    return 0;
  }

  return Math.max(0, Math.round((secondDeparture - firstArrival) / 60000));
}

function parseIsoDuration(value) {
  const match = String(value ?? '').match(/^PT(?:(\d+)H)?(?:(\d+)M)?$/);

  if (!match) {
    return 0;
  }

  return Number(match[1] ?? 0) * 60 + Number(match[2] ?? 0);
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
    firstSegment.departure?.iataCode,
    firstSegment.arrival?.iataCode,
    lastSegment.arrival?.iataCode,
    firstSegment.departure?.at,
  ]
    .filter(Boolean)
    .join('-');
}
