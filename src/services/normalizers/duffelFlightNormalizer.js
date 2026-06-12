export function normalizeDuffelOfferRequest(response, { query } = {}) {
  const offers = Array.isArray(response?.data?.offers) ? response.data.offers : [];

  return offers.map((offer) => normalizeOffer(offer, query));
}

function normalizeOffer(offer, query = {}) {
  const rawSegments = getOfferSegments(offer);

  if (!Array.isArray(rawSegments) || rawSegments.length < 2) {
    throw new Error('Duffel offer is missing itinerary segments.');
  }

  const { segments, scheduleAdjusted } = getChronologicalSegments(rawSegments, query);
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
      layoverDisplay: `${formatDuration(layoverMinutes)} layover`,
      scheduleAdjusted,
    },
    availability: {
      seats: passengerCount,
      canBookAdults: passengerCount >= Number(query.adults ?? 1),
    },
  };
}

function getOfferSegments(offer) {
  if (!Array.isArray(offer?.slices)) {
    return [];
  }

  return offer.slices.flatMap((slice) => (Array.isArray(slice?.segments) ? slice.segments : []));
}

function getChronologicalSegments(segments, query = {}) {
  const adjustedSegments = segments.map((segment) => ({ ...segment }));
  let scheduleAdjusted = false;

  for (let index = 1; index < adjustedSegments.length; index += 1) {
    const previousArrival = parseDateTime(adjustedSegments[index - 1].arriving_at);
    const currentDeparture = parseDateTime(adjustedSegments[index].departing_at);

    if (!previousArrival || !currentDeparture || currentDeparture >= previousArrival) {
      continue;
    }

    const stayMinutes = getEstimatedStayMinutes(segments, query);
    const flightMinutes = getSegmentDurationMinutes(adjustedSegments[index]);
    const adjustedDeparture = addMinutes(previousArrival, stayMinutes);

    adjustedSegments[index].departing_at = formatIsoDateTime(adjustedDeparture);

    if (flightMinutes > 0) {
      adjustedSegments[index].arriving_at = formatIsoDateTime(addMinutes(adjustedDeparture, flightMinutes));
    }

    scheduleAdjusted = true;
  }

  return {
    segments: adjustedSegments,
    scheduleAdjusted,
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
  return `${segment.marketing_carrier?.iata_code ?? ''}${formatFlightNumber(segment.marketing_carrier_flight_number)}`;
}

function formatFlightNumber(value) {
  return String(value ?? '').replace(/^0+(?=\d)/, '');
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
  const firstArrival = parseDateTime(firstSegment.arriving_at);
  const secondDeparture = parseDateTime(secondSegment.departing_at);

  if (!firstArrival || !secondDeparture) {
    return 0;
  }

  return Math.max(0, Math.round((secondDeparture.getTime() - firstArrival.getTime()) / 60000));
}

function getTotalMinutes(firstSegment, lastSegment) {
  const departure = parseDateTime(firstSegment.departing_at);
  const arrival = parseDateTime(lastSegment.arriving_at);

  if (!departure || !arrival) {
    return 0;
  }

  return Math.max(0, Math.round((arrival.getTime() - departure.getTime()) / 60000));
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
  const [date = '', time = ''] = String(value ?? '').split('T');

  return `${date} ${time.slice(0, 5)}`.trim();
}

function getDate(value) {
  return String(value ?? '').split('T')[0] ?? '';
}

function getEstimatedStayMinutes(segments, query = {}) {
  const originalTotalMinutes = getMinutesBetween(segments[0]?.departing_at, segments[segments.length - 1]?.arriving_at);

  if (originalTotalMinutes > 0) {
    return originalTotalMinutes;
  }

  const minimumLayoverHours = Number(query.minLayover);

  if (Number.isFinite(minimumLayoverHours) && minimumLayoverHours > 0) {
    return Math.round(minimumLayoverHours * 60);
  }

  return 0;
}

function getSegmentDurationMinutes(segment) {
  const durationMinutes = parseIsoDuration(segment.duration);

  if (durationMinutes > 0) {
    return durationMinutes;
  }

  return getMinutesBetween(segment.departing_at, segment.arriving_at);
}

function getMinutesBetween(startValue, endValue) {
  const start = parseDateTime(startValue);
  const end = parseDateTime(endValue);

  if (!start || !end) {
    return 0;
  }

  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000));
}

function parseIsoDuration(value) {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?$/.exec(String(value ?? ''));

  if (!match) {
    return 0;
  }

  return Number(match[1] ?? 0) * 60 + Number(match[2] ?? 0);
}

function parseDateTime(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(String(value ?? ''));

  if (!match) {
    return undefined;
  }

  return new Date(
    Date.UTC(
      Number(match[1]),
      Number(match[2]) - 1,
      Number(match[3]),
      Number(match[4]),
      Number(match[5]),
    ),
  );
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

function formatIsoDateTime(date) {
  return `${date.getUTCFullYear()}-${padDatePart(date.getUTCMonth() + 1)}-${padDatePart(date.getUTCDate())}T${padDatePart(date.getUTCHours())}:${padDatePart(date.getUTCMinutes())}:00`;
}

function padDatePart(value) {
  return String(value).padStart(2, '0');
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
