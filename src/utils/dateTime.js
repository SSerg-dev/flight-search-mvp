export function getTodayDateString(date = new Date()) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return '';
  }

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

export function parseDateOnly(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value ?? ''));

  if (!match) {
    return undefined;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    Number.isNaN(date.getTime()) ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return undefined;
  }

  return date;
}

export function parseFlightDateTime(value) {
  const match = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}):(\d{2})$/.exec(String(value ?? '').trim());

  if (!match) {
    return undefined;
  }

  const date = parseDateOnly(match[1]);
  const hours = Number(match[2]);
  const minutes = Number(match[3]);

  if (!date || hours > 23 || minutes > 59) {
    return undefined;
  }

  date.setUTCHours(hours, minutes, 0, 0);
  return date;
}

export function isDateAfterToday(value, currentDate = new Date()) {
  const date = parseDateOnly(value);
  const today = parseDateOnly(getTodayDateString(currentDate));

  return Boolean(date && today && date > today);
}

export function isFlightTimingValid(flight, { currentDate = new Date() } = {}) {
  if (!Array.isArray(flight?.segments) || flight.segments.length === 0) {
    return false;
  }

  const today = parseDateOnly(getTodayDateString(currentDate));
  let latestArrival;

  for (const segment of flight.segments) {
    const departure = parseFlightDateTime(segment.departure);
    const arrival = parseFlightDateTime(segment.arrival);

    if (!departure || !arrival || arrival <= departure) {
      return false;
    }

    latestArrival = arrival;
  }

  return Boolean(today && latestArrival && parseDateOnly(latestArrival.toISOString().slice(0, 10)) > today);
}
