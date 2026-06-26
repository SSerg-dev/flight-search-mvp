export function createResultCard(flight) {
  const firstSegment = flight.segments?.[0] ?? {};
  const lastSegment = flight.segments?.[flight.segments.length - 1] ?? firstSegment;
  const flightNumbers = flight.airline?.flightNumbers?.length
    ? flight.airline.flightNumbers.join(' / ')
    : 'Flight details pending';
  const priceDisplay = hasText(flight.price?.display) ? flight.price.display : 'Price unavailable';
  const segmentTimingDisplay = createSegmentTimingDisplay(flight);
  const durationDisplay = createDurationDisplay(flight);
  const departurePeriodBadge = createDeparturePeriodBadge(firstSegment.departure);

  return `
    <article class="grid gap-4 rounded border border-slate-200 bg-white p-4 shadow-sm transition hover:border-sky-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-sky-600 sm:grid-cols-[1fr_auto] sm:items-start sm:p-5">
      <div class="grid gap-3">
        <div>
          <h2 class="text-lg font-semibold text-slate-950 dark:text-slate-100">${escapeHtml(flight.airline?.name)}</h2>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">${escapeHtml(flightNumbers)}</p>
        </div>

        <div class="grid gap-2 text-sm text-slate-700 dark:text-slate-300">
          <p class="font-medium text-slate-900 dark:text-slate-100">
            ${escapeHtml(flight.route?.origin?.city)} to ${escapeHtml(flight.route?.stopover?.city)} to ${escapeHtml(flight.route?.destination?.city)}
          </p>
          ${departurePeriodBadge}
          ${segmentTimingDisplay}
          ${durationDisplay}
        </div>
      </div>

      <div class="grid gap-1 text-left sm:text-right">
        <p class="text-2xl font-semibold text-slate-950 dark:text-white">${escapeHtml(priceDisplay)}</p>
        <p class="text-sm text-slate-600 dark:text-slate-400">
          ${escapeHtml(flight.price?.currency)} total for ${escapeHtml(flight.price?.passengerCount)} adults
        </p>
      </div>
    </article>
  `;
}

function createDeparturePeriodBadge(dateTime) {
  const period = getDeparturePeriod(dateTime);

  if (!period) {
    return '';
  }

  const badgeClass =
    period === 'day'
      ? 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/40 dark:bg-amber-400/10 dark:text-amber-200'
      : 'border-indigo-200 bg-indigo-50 text-indigo-800 dark:border-indigo-400/40 dark:bg-indigo-400/10 dark:text-indigo-200';
  const label = period === 'day' ? 'Daytime departure' : 'Night departure';
  const icon = period === 'day' ? '☀' : '☾';
  const iconName = period === 'day' ? 'Sun' : 'Moon';
  const text = period === 'day' ? 'Day departure' : 'Night departure';

  return `
          <p>
            <span aria-label="${label}" class="inline-flex w-fit items-center gap-1 rounded border px-2 py-1 text-xs font-semibold ${badgeClass}">
              <span aria-hidden="true">${icon}</span><span class="sr-only">${iconName}</span>${text}
            </span>
          </p>
  `;
}

function getDeparturePeriod(dateTime) {
  const time = getTime(dateTime);
  const hour = Number(time.split(':')[0]);

  if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
    return '';
  }

  return hour >= 6 && hour < 18 ? 'day' : 'night';
}

function createSegmentTimingDisplay(flight) {
  if (!Array.isArray(flight.segments) || flight.segments.length === 0) {
    return '<p>Schedule details pending</p>';
  }

  const segmentLines = flight.segments.map(createSegmentTimingLine).join('');

  if (!hasText(segmentLines)) {
    return '<p>Schedule details pending</p>';
  }

  return `<div class="grid gap-1">${segmentLines}</div>`;
}

function createSegmentTimingLine(segment, index) {
  if (
    !hasText(segment.from) ||
    !hasText(segment.to) ||
    !hasText(segment.departure) ||
    !hasText(segment.arrival)
  ) {
    return '';
  }

  const departureDateDisplay = index === 0 ? getDateWithWeekdayMarkup(segment.departure) : escapeHtml(getDate(segment.departure));

  return `
            <p>${escapeHtml(segment.from)} Depart ${departureDateDisplay} at ${escapeHtml(getTime(segment.departure))} -&gt; ${escapeHtml(segment.to)} Arrive ${escapeHtml(getDate(segment.arrival))} at ${escapeHtml(getTime(segment.arrival))}</p>
  `;
}

function createDurationDisplay(flight) {
  if (!hasText(flight.duration?.display)) {
    return '<p>Duration details pending</p>';
  }

  if (flight.duration?.scheduleAdjusted) {
    return `
          <p>
            Stay in ${escapeHtml(flight.route?.stopover?.city)}
          </p>
          <p class="font-semibold text-slate-900 dark:text-slate-100">
            ${escapeHtml(getStayDisplay(flight))}
          </p>
  `;
  }

  const layoverDisplay =
    Number(flight.duration?.layoverMinutes) > 0 && hasText(flight.duration?.layoverDisplay)
      ? `${flight.duration.layoverDisplay} in ${flight.route?.stopover?.city}`
      : `Stay in ${flight.route?.stopover?.city}`;

  const totalSuffix = Number(flight.duration?.layoverMinutes) > 0 ? ' total' : '';

  return `
          <p>
            ${escapeHtml(layoverDisplay)}
          </p>
          <p class="font-semibold text-slate-900 dark:text-slate-100">
            ${escapeHtml(flight.duration.display)}${totalSuffix}
          </p>
  `;
}

function getStayDisplay(flight) {
  if (!hasText(flight.duration?.layoverDisplay)) {
    return flight.duration.display;
  }

  return String(flight.duration.layoverDisplay).replace(/\s+layover$/, '');
}

function getDate(dateTime) {
  return String(dateTime).split(' ')[0] ?? '';
}

function getDateWithWeekdayMarkup(dateTime) {
  const date = getDate(dateTime);
  const weekday = getWeekday(date);

  if (!hasText(weekday)) {
    return escapeHtml(date);
  }

  return `${escapeHtml(date)} <span class="font-bold italic">${escapeHtml(weekday)}</span>`;
}

function getWeekday(date) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(date ?? ''));

  if (!match) {
    return '';
  }

  const value = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));

  if (Number.isNaN(value.getTime())) {
    return '';
  }

  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][value.getUTCDay()];
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
