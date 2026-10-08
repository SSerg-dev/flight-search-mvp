import { parseDateOnly } from './dateTime.js';

export const MAX_SEARCH_DAYS = 2;
export const SEARCH_DATE_RANGE_ERROR = 'Choose one day or two consecutive days maximum.';

export function getSearchDayCount(range) {
  const start = parseDateOnly(range?.start);
  const end = parseDateOnly(range?.end);
  return start && end && end >= start ? (end - start) / 86400000 + 1 : 0;
}

export function getMaximumSearchEndDate(startValue) {
  const date = parseDateOnly(startValue);
  if (!date) return '';
  date.setUTCDate(date.getUTCDate() + MAX_SEARCH_DAYS - 1);
  return date.toISOString().slice(0, 10);
}

export function normalizeSearchDates(query) {
  const dateRange = normalizeRange(query.dateRange);
  let returnDateRange = { ...query.returnDateRange };
  if (query.tripType === 'roundTrip' && parseDateOnly(dateRange.end)) {
    if (!parseDateOnly(returnDateRange.start) || returnDateRange.start < dateRange.end) {
      returnDateRange.start = dateRange.end;
    }
    returnDateRange = normalizeRange(returnDateRange);
  }
  return { ...query, departureDate: dateRange.start, dateRange, returnDateRange };
}

function normalizeRange(range = {}) {
  const result = { ...range };
  const maximum = getMaximumSearchEndDate(result.start);
  if (!maximum) return result;
  if (!parseDateOnly(result.end) || result.end < result.start) result.end = result.start;
  if (result.end > maximum) result.end = maximum;
  return result;
}

export function getSearchRequestCount(query) {
  const outbound = getSearchDayCount(query.dateRange);
  const inbound = query.tripType === 'roundTrip' ? getSearchDayCount(query.returnDateRange) : 0;
  if (!outbound || outbound > MAX_SEARCH_DAYS ||
      (query.tripType === 'roundTrip' && (!inbound || inbound > MAX_SEARCH_DAYS))) return null;
  return outbound + inbound;
}
