import {
  findAirportById,
  findAirportByIata,
  findRouteLocationById,
  formatRouteLocationOptionValue,
  resolveAirport,
  resolveRouteLocation,
} from '../services/airportMetadataService.js';
import { getTodayDateString } from '../utils/dateTime.js';

export const searchFormDefaults = {
  tripType: 'oneWay',
  fromAirportId: 'oa:3422',
  from: 'Boston',
  viaAirportId: '',
  via: '',
  connectionPreference: 'all',
  toAirportId: 'oa:6489',
  to: 'Saint Petersburg',
  departureDate: '2026-10-01',
  dateRange: {
    start: '2026-10-01',
    end: '2026-10-10',
  },
  returnDateRange: {
    start: '',
    end: '',
  },
  adults: 2,
  minLayover: 3,
  maxLayover: 12,
};

const inputClass =
  'h-11 rounded border border-slate-300 bg-white px-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-sky-400 dark:focus:ring-sky-700';

function createFieldError(fieldName, errors) {
  if (!errors?.[fieldName]) {
    return '';
  }

  return `<p class="text-sm font-medium text-red-600" data-error-for="${fieldName}" id="${fieldName}-error" role="alert">${escapeHtml(errors[fieldName])}</p>`;
}

function createErrorAttributes(fieldName, errors) {
  if (!errors?.[fieldName]) {
    return 'aria-invalid="false"';
  }

  return `aria-invalid="true" aria-describedby="${fieldName}-error"`;
}

function createAirportCombobox({ id, label, values, errors, optional = false }) {
  const airportId = values?.[`${id}AirportId`] ?? '';
  const airport = findRouteLocationById(airportId) ?? resolveRouteLocation(values?.[id]);
  const displayValue = airport ? formatRouteLocationOptionValue(airport) : String(values?.[id] ?? '');
  const selectedId = airport?.id ?? airportId;
  const optionalLabel = optional
    ? '<span class="font-normal text-slate-500 dark:text-slate-400">Optional</span>'
    : '';

  return `
    <div class="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-300" data-airport-combobox="${id}">
      <label class="flex min-h-5 items-center justify-between gap-2" for="${id}">
        <span>${label}</span>${optionalLabel}
      </label>
      <div class="relative">
        <input name="${id}AirportId" type="hidden" value="${escapeHtml(selectedId)}" />
        <input
          class="${inputClass} w-full pr-10"
          id="${id}"
          name="${id}Search"
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-controls="${id}-options"
          aria-expanded="false"
          autocomplete="off"
          placeholder="City, country, airport or IATA"
          value="${escapeHtml(displayValue)}"
          ${createErrorAttributes(id, errors)}
        />
        <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400" aria-hidden="true">⌄</span>
        <div
          class="absolute z-20 mt-1 hidden max-h-72 w-full overflow-y-auto rounded border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
          id="${id}-options"
          role="listbox"
        ></div>
      </div>
      ${createFieldError(id, errors)}
    </div>
  `;
}

function createViaRouteField({ values, errors, routeOptions = [], routeOptionsStatus = 'idle' }) {
  const selectedValue = getSelectedViaRouteValue(values);
  const options = [...routeOptions];
  const selectedAirport = findAirportById(values?.viaAirportId) ?? resolveAirport(values?.via);

  if (
    values?.connectionPreference === 'via' &&
    selectedAirport &&
    !options.some((option) => option.code === selectedAirport.iata)
  ) {
    options.push({
      key: `via:${selectedAirport.iata}`,
      type: 'via',
      code: selectedAirport.iata,
      airportId: selectedAirport.id,
      label: `${selectedAirport.iata} — ${selectedAirport.name}, ${selectedAirport.city}`,
    });
  }

  const statusText = createViaStatusText(routeOptionsStatus);

  return `
    <div class="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
      <label class="flex min-h-5 items-center justify-between gap-2" for="via">
        <span>Via</span><span class="font-normal text-slate-500 dark:text-slate-400">Dynamic</span>
      </label>
      <div class="relative">
        <select
          class="${inputClass} w-full appearance-none pr-10"
          id="via"
          name="viaRoute"
          ${createErrorAttributes('via', errors)}
        >
          <option value="all"${selectedValue === 'all' ? ' selected' : ''}>All available routes</option>
          ${options.map((option) => createViaRouteOption(option, selectedValue)).join('')}
        </select>
        <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400" aria-hidden="true">⌄</span>
      </div>
      ${statusText}
      ${createFieldError('via', errors)}
    </div>
  `;
}

function createViaStatusText(status) {
  if (status === 'loading') {
    return '<p class="text-xs font-normal text-slate-500 dark:text-slate-400">Finding available routes…</p>';
  }

  if (status === 'loaded') {
    return '<p class="text-xs font-normal text-slate-500 dark:text-slate-400">Options loaded from the latest search.</p>';
  }

  if (status === 'error') {
    return '<p class="text-xs font-normal text-red-600 dark:text-red-300">Route options could not be loaded.</p>';
  }

  return '<p class="text-xs font-normal text-slate-500 dark:text-slate-400">Options load after you search this route and date range.</p>';
}

function createViaRouteOption(option, selectedValue) {
  const value = option.type === 'direct' ? 'direct' : `via:${option.code}`;

  return `<option value="${escapeHtml(value)}"${selectedValue === value ? ' selected' : ''}>${escapeHtml(option.label)}</option>`;
}

function getSelectedViaRouteValue(values) {
  if (values?.connectionPreference === 'direct') return 'direct';

  if (values?.connectionPreference === 'via') {
    const airport = findAirportById(values.viaAirportId) ?? resolveAirport(values.via);
    return airport ? `via:${airport.iata}` : 'all';
  }

  return 'all';
}

function createNumberField({ id, label, value, min, errors }) {
  return `
    <label class="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-300" for="${id}">
      <span class="block min-h-5">${label}</span>
      <input
        class="${inputClass}"
        id="${id}"
        name="${id}"
        type="number"
        min="${min}"
        value="${escapeHtml(value)}"
        ${createErrorAttributes(id, errors)}
      />
      ${createFieldError(id, errors)}
    </label>
  `;
}

function createDateField({ id, label, value, min, errors }) {
  return `
    <label class="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-300" for="${id}">
      <span class="block min-h-5">${label}</span>
      <input
        class="${inputClass}"
        id="${id}"
        name="${id}"
        type="date"
        min="${escapeHtml(min)}"
        value="${escapeHtml(value)}"
        ${createErrorAttributes(id, errors)}
      />
      ${createFieldError(id, errors)}
    </label>
  `;
}

export function createSearchQueryFromFormData(formData) {
  const dateRangeStart = String(formData.get('dateRangeStart') ?? '');
  const tripType = String(formData.get('tripType') ?? 'oneWay');
  const from = normalizeEndpointSelection(formData, 'from');
  const viaSelection = normalizeViaRouteSelection(formData);
  const to = normalizeEndpointSelection(formData, 'to');

  return {
    tripType,
    fromAirportId: from.airportId,
    from: from.value,
    viaAirportId: viaSelection.airportId,
    via: viaSelection.value,
    connectionPreference: viaSelection.connectionPreference,
    toAirportId: to.airportId,
    to: to.value,
    departureDate: dateRangeStart,
    dateRange: {
      start: dateRangeStart,
      end: String(formData.get('dateRangeEnd') ?? ''),
    },
    returnDateRange: {
      start: String(formData.get('returnDateRangeStart') ?? ''),
      end: String(formData.get('returnDateRangeEnd') ?? ''),
    },
    adults: toOptionalNumber(formData.get('adults')),
    minLayover: toOptionalNumber(formData.get('minLayover')),
    maxLayover: toOptionalNumber(formData.get('maxLayover')),
  };
}

function normalizeViaRouteSelection(formData) {
  if (!formData.has('viaRoute')) {
    const via = normalizeRouteSelection(formData, 'via');

    return {
      ...via,
      connectionPreference: via.value ? 'via' : 'all',
    };
  }

  const routeValue = String(formData.get('viaRoute') ?? 'all').trim();

  if (routeValue === 'direct') {
    return { airportId: '', value: '', connectionPreference: 'direct' };
  }

  if (routeValue.startsWith('via:')) {
    const airport = findAirportByIata(routeValue.slice(4));

    if (airport) {
      return { airportId: airport.id, value: airport.city, connectionPreference: 'via' };
    }
  }

  return { airportId: '', value: '', connectionPreference: 'all' };
}

function normalizeRouteSelection(formData, fieldName) {
  const airportId = String(formData.get(`${fieldName}AirportId`) ?? '').trim();
  const rawValue = formData.get(`${fieldName}Search`) ?? formData.get(fieldName) ?? '';
  const airport = findAirportById(airportId) ?? resolveAirport(rawValue);

  if (airport) {
    return { airportId: airport.id, value: airport.city };
  }

  return { airportId: '', value: String(rawValue).trim() };
}

function normalizeEndpointSelection(formData, fieldName) {
  const locationId = String(formData.get(`${fieldName}AirportId`) ?? '').trim();
  const rawValue = formData.get(`${fieldName}Search`) ?? formData.get(fieldName) ?? '';
  const location = findRouteLocationById(locationId) ?? resolveRouteLocation(rawValue);

  if (location) {
    return { airportId: location.id, value: location.city };
  }

  return { airportId: '', value: String(rawValue).trim() };
}

export function createSearchForm({
  theme = 'light',
  values = searchFormDefaults,
  errors = {},
  isLoading = false,
  savedSearches = [],
  routeOptions = [],
  routeOptionsStatus = 'idle',
} = {}) {
  const buttonText = isLoading ? 'Searching...' : 'Search Flights';
  const loadingAttributes = isLoading ? 'disabled aria-busy="true"' : 'aria-busy="false"';
  const minimumDepartureDate = getNextDateString(getTodayDateString());

  return `
    <main class="bg-slate-50 px-4 py-6 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <section class="mx-auto max-w-5xl">
        <div class="mb-5 grid gap-4 sm:mb-6 sm:grid-cols-[1fr_auto] sm:items-start">
          <div>
            <h1 class="text-2xl font-semibold tracking-normal text-slate-950 dark:text-slate-50 sm:text-3xl">
              Flight Search
            </h1>
            <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              Choose a specific airport or all airports in a city, then filter by available connections.
            </p>
          </div>
          ${createThemeToggle(theme)}
        </div>

        <form class="grid gap-5 rounded border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900 sm:p-6 lg:gap-6" novalidate>
          ${createFieldError('route', errors)}

          ${createTripTypeControl(values.tripType)}

          <div class="grid items-start gap-4 md:grid-cols-3">
            ${createAirportCombobox({
              id: 'from',
              label: 'From',
              values,
              errors,
            })}
            ${createViaRouteField({ values, errors, routeOptions, routeOptionsStatus })}
            ${createAirportCombobox({
              id: 'to',
              label: 'To',
              values,
              errors,
            })}
          </div>

          <div class="grid gap-3">
            <p class="text-sm font-medium text-slate-700 dark:text-slate-300">Date Range</p>
            <div class="grid items-start gap-4 md:grid-cols-2">
              ${createDateField({
                id: 'dateRangeStart',
                label: 'Departure Date Start',
                value: values.dateRange.start,
                min: minimumDepartureDate,
                errors,
              })}
              ${createDateField({
                id: 'dateRangeEnd',
                label: 'Departure Date End',
                value: values.dateRange.end,
                min: values.dateRange.start || minimumDepartureDate,
                errors,
              })}
            </div>
            ${createFieldError('dateRange', errors)}
          </div>

          ${createReturnDateRangeFields(values, errors, minimumDepartureDate)}

          <div class="grid gap-4 md:grid-cols-3">
            ${createNumberField({
              id: 'adults',
              label: 'Adults',
              min: 1,
              value: values.adults,
              errors,
            })}
            ${createNumberField({
              id: 'minLayover',
              label: 'Min Layover Hours',
              min: 0,
              value: values.minLayover,
              errors,
            })}
            ${createNumberField({
              id: 'maxLayover',
              label: 'Max Layover Hours',
              min: 0,
              value: values.maxLayover,
              errors,
            })}
          </div>
          ${createFieldError('layover', errors)}

          <div class="flex justify-stretch sm:justify-start">
            <button
              class="h-11 w-full rounded bg-sky-600 px-5 text-sm font-semibold text-white transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-white dark:bg-sky-500 dark:hover:bg-sky-400 dark:focus:ring-sky-300 dark:focus:ring-offset-slate-900 sm:w-auto"
              type="submit"
              ${loadingAttributes}
            >
              ${buttonText}
            </button>
          </div>
        </form>
        ${createSavedSearchesMarkup(savedSearches)}
      </section>
    </main>
  `;
}

function createSavedSearchesMarkup(savedSearches) {
  if (!Array.isArray(savedSearches) || savedSearches.length === 0) {
    return '';
  }

  return `
        <section class="mt-5 grid gap-3 rounded border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-5" aria-label="Recent searches">
          <div class="flex items-center justify-between gap-3">
            <h2 class="text-base font-semibold text-slate-950 dark:text-slate-100">Recent searches</h2>
            <button
              class="text-sm font-semibold text-slate-600 transition hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-300 dark:text-slate-300 dark:hover:text-white dark:focus:ring-sky-500"
              id="clear-saved-searches"
              type="button"
            >
              Clear
            </button>
          </div>
          <div class="grid gap-2">
            ${savedSearches.map(createSavedSearchButton).join('')}
          </div>
        </section>
  `;
}

function createSavedSearchButton(savedSearch) {
  const query = savedSearch.query ?? {};
  const tripLabel = query.tripType === 'roundTrip' ? 'Round-trip' : 'One-way';

  return `
            <button
              class="grid gap-1 rounded border border-slate-200 bg-slate-50 px-3 py-2 text-left transition hover:border-sky-300 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-300 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-sky-600 dark:hover:bg-slate-800 dark:focus:ring-sky-500"
              type="button"
              data-saved-search-id="${escapeHtml(savedSearch.id)}"
            >
              <span class="text-sm font-semibold text-slate-950 dark:text-slate-100">${escapeHtml(createRouteSummary(query))}</span>
              <span class="text-sm text-slate-600 dark:text-slate-300">${escapeHtml(tripLabel)} - ${escapeHtml(formatSearchDates(query))} - ${escapeHtml(query.adults)} adults - ${escapeHtml(query.minLayover)}-${escapeHtml(query.maxLayover)}h layover</span>
            </button>
  `;
}

function createRouteSummary(query) {
  const route = [query.from, query.via, query.to].filter((value) => String(value ?? '').trim());

  return route.join(' to ');
}

function formatSearchDates(query) {
  const departureDates = `${query.dateRange?.start ?? ''} to ${query.dateRange?.end ?? ''}`;

  if (query.tripType !== 'roundTrip') {
    return departureDates;
  }

  return `${departureDates}, return ${query.returnDateRange?.start ?? ''} to ${query.returnDateRange?.end ?? ''}`;
}

function createTripTypeControl(tripType) {
  const selectedTripType = tripType === 'roundTrip' ? 'roundTrip' : 'oneWay';

  return `
    <fieldset class="grid gap-2">
      <legend class="text-sm font-medium text-slate-700 dark:text-slate-300">Trip Type</legend>
      <div class="grid gap-2 sm:flex">
        ${createTripTypeOption({
          value: 'oneWay',
          label: 'One-way',
          selectedTripType,
        })}
        ${createTripTypeOption({
          value: 'roundTrip',
          label: 'Round-trip',
          selectedTripType,
        })}
      </div>
    </fieldset>
  `;
}

function createTripTypeOption({ value, label, selectedTripType }) {
  const checkedAttribute = value === selectedTripType ? ' checked' : '';

  return `
    <label class="flex h-11 items-center gap-2 rounded border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition-colors dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
      <input
        class="h-4 w-4 text-sky-600 dark:text-sky-400"
        type="radio"
        name="tripType"
        value="${value}"
        ${checkedAttribute}
      />
      <span>${label}</span>
    </label>
  `;
}

function createReturnDateRangeFields(values, errors, minimumDepartureDate) {
  if (values.tripType !== 'roundTrip') {
    return '';
  }

  return `
    <div class="grid gap-3">
      <p class="text-sm font-medium text-slate-700 dark:text-slate-300">Return Date Range</p>
      <div class="grid items-start gap-4 md:grid-cols-2">
        ${createDateField({
          id: 'returnDateRangeStart',
          label: 'Return Date Start',
          value: values.returnDateRange?.start ?? '',
          min: values.dateRange?.end || values.dateRange?.start || minimumDepartureDate,
          errors,
        })}
        ${createDateField({
          id: 'returnDateRangeEnd',
          label: 'Return Date End',
          value: values.returnDateRange?.end ?? '',
          min: values.returnDateRange?.start || values.dateRange?.end || values.dateRange?.start || minimumDepartureDate,
          errors,
        })}
      </div>
      ${createFieldError('returnDateRange', errors)}
    </div>
  `;
}

function getNextDateString(value) {
  const date = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

function toOptionalNumber(value) {
  if (String(value ?? '').trim() === '') {
    return '';
  }

  return Number(value);
}

function createThemeToggle(theme) {
  const isDark = theme === 'dark';
  const label = isDark ? 'Switch to light theme' : 'Switch to dark theme';
  const icon = isDark ? createMoonIcon() : createSunIcon();

  return `
    <button
      class="inline-flex h-10 w-10 items-center justify-center rounded border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-sky-500 dark:hover:bg-slate-800 dark:hover:text-white dark:focus:ring-sky-500 dark:focus:ring-offset-slate-950"
      id="theme-toggle"
      type="button"
      aria-label="${label}"
      aria-pressed="${isDark}"
    >
      ${icon}
    </button>
  `;
}

function createSunIcon() {
  return `
      <svg class="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="4"></circle>
        <path d="M12 2v2"></path>
        <path d="M12 20v2"></path>
        <path d="m4.93 4.93 1.41 1.41"></path>
        <path d="m17.66 17.66 1.41 1.41"></path>
        <path d="M2 12h2"></path>
        <path d="M20 12h2"></path>
        <path d="m6.34 17.66-1.41 1.41"></path>
        <path d="m19.07 4.93-1.41 1.41"></path>
      </svg>`;
}

function createMoonIcon() {
  return `
      <svg class="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a7 7 0 1 0 11 11Z"></path>
      </svg>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
