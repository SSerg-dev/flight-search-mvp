export function createResultCard(flight) {
  const firstSegment = flight.segments?.[0] ?? {};
  const lastSegment = flight.segments?.[flight.segments.length - 1] ?? firstSegment;
  const flightNumbers = flight.airline?.flightNumbers?.length
    ? flight.airline.flightNumbers.join(' / ')
    : 'Flight details pending';
  const priceDisplay = hasText(flight.price?.display) ? flight.price.display : 'Price unavailable';
  const timingDisplay = createTimingDisplay(flight, firstSegment, lastSegment);
  const durationDisplay = createDurationDisplay(flight);

  return `
    <article class="grid gap-4 rounded border border-slate-200 bg-white p-4 shadow-sm transition hover:border-sky-300 hover:shadow-md sm:grid-cols-[1fr_auto] sm:items-start sm:p-5">
      <div class="grid gap-3">
        <div>
          <h2 class="text-lg font-semibold text-slate-950">${escapeHtml(flight.airline?.name)}</h2>
          <p class="mt-1 text-sm text-slate-600">${escapeHtml(flightNumbers)}</p>
        </div>

        <div class="grid gap-2 text-sm text-slate-700">
          <p class="font-medium text-slate-900">
            ${escapeHtml(flight.route?.origin?.city)} to ${escapeHtml(flight.route?.stopover?.city)} to ${escapeHtml(flight.route?.destination?.city)}
          </p>
          ${timingDisplay}
          ${durationDisplay}
        </div>
      </div>

      <div class="grid gap-1 text-left sm:text-right">
        <p class="text-2xl font-semibold text-slate-950">${escapeHtml(priceDisplay)}</p>
        <p class="text-sm text-slate-600">
          ${escapeHtml(flight.price?.currency)} total for ${escapeHtml(flight.price?.passengerCount)} adults
        </p>
      </div>
    </article>
  `;
}

function createTimingDisplay(flight, firstSegment, lastSegment) {
  if (!hasText(flight.route?.departureDate) || !hasText(firstSegment.departure) || !hasText(lastSegment.arrival)) {
    return '<p>Schedule details pending</p>';
  }

  return `
          <p>
            Depart ${escapeHtml(flight.route.departureDate)} at ${escapeHtml(getTime(firstSegment.departure))}
            · Arrive ${escapeHtml(getDate(lastSegment.arrival))} at ${escapeHtml(getTime(lastSegment.arrival))}
          </p>
  `;
}

function createDurationDisplay(flight) {
  if (!hasText(flight.duration?.layoverDisplay) || !hasText(flight.duration?.display)) {
    return '<p>Duration details pending</p>';
  }

  return `
          <p>
            ${escapeHtml(flight.duration.layoverDisplay)} in ${escapeHtml(flight.route?.stopover?.city)}
            · ${escapeHtml(flight.duration.display)} total
          </p>
  `;
}

function getDate(dateTime) {
  return String(dateTime).split(' ')[0] ?? '';
}

function getTime(dateTime) {
  return String(dateTime).split(' ')[1] ?? '';
}

function hasText(value) {
  return String(value ?? '').trim().length > 0;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
