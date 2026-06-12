export function validateSearchQuery(query) {
  const errors = {};

  if (!hasText(query?.from)) {
    errors.from = 'From is required.';
  }

  if (!hasText(query?.via)) {
    errors.via = 'Via is required.';
  }

  if (!hasText(query?.to)) {
    errors.to = 'To is required.';
  }

  if (!hasText(query?.dateRange?.start) || !hasText(query?.dateRange?.end)) {
    errors.dateRange = 'Date Range is required.';
  }

  if (!hasText(query?.adults)) {
    errors.adults = 'Adults is required.';
  }

  if (!hasText(query?.minLayover)) {
    errors.minLayover = 'Min Layover Hours is required.';
  }

  if (!hasText(query?.maxLayover)) {
    errors.maxLayover = 'Max Layover Hours is required.';
  }

  if (!errors.from && !errors.via && !errors.to && hasDuplicateRoutePoint(query)) {
    errors.route = 'From, Via, and To must be different.';
  }

  if (!errors.adults && Number(query.adults) < 1) {
    errors.adults = 'Adults must be at least 1.';
  }

  if (!errors.dateRange && query.dateRange.start > query.dateRange.end) {
    errors.dateRange = 'Date Range start date must be before or equal to end date.';
  }

  if (!errors.minLayover && !errors.maxLayover && Number(query.minLayover) > Number(query.maxLayover)) {
    errors.layover = 'Min Layover Hours cannot be greater than Max Layover Hours.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

function hasText(value) {
  return String(value ?? '').trim().length > 0;
}

function hasDuplicateRoutePoint(query) {
  const routePoints = [query.from, query.via, query.to].map((value) => value.trim().toLowerCase());

  return new Set(routePoints).size !== routePoints.length;
}
