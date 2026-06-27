import { airports } from '../data/airports.js';

export const searchFormDefaults = {
  tripType: 'oneWay',
  from: 'Boston',
  via: 'Istanbul',
  to: 'Saint Petersburg',
  departureDate: '2026-08-01',
  dateRange: {
    start: '2026-08-01',
    end: '2026-08-10',
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

function createTextField({ id, label, value, errors, listId = '' }) {
  const listAttribute = listId ? `list="${escapeHtml(listId)}"` : '';

  return `
    <label class="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-300" for="${id}">
      <span class="block min-h-5">${label}</span>
      <input
        class="${inputClass}"
        id="${id}"
        name="${id}"
        type="text"
        value="${escapeHtml(value)}"
        ${listAttribute}
        ${createErrorAttributes(id, errors)}
      />
      ${createFieldError(id, errors)}
    </label>
  `;
}

function createAirportSuggestionsDatalist() {
  const options = airports
    .map(
      (airport) =>
        `<option value="${escapeHtml(airport.city)}" label="${escapeHtml(`${airport.iata} - ${airport.name}`)}"></option>`,
    )
    .join('');

  return `<datalist id="airport-suggestions">${options}</datalist>`;
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

function createDateField({ id, label, value, errors }) {
  return `
    <label class="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-300" for="${id}">
      <span class="block min-h-5">${label}</span>
      <input
        class="${inputClass}"
        id="${id}"
        name="${id}"
        type="date"
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

  return {
    tripType,
    from: String(formData.get('from') ?? '').trim(),
    via: String(formData.get('via') ?? '').trim(),
    to: String(formData.get('to') ?? '').trim(),
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

export function createSearchForm({ theme = 'light', values = searchFormDefaults, errors = {}, isLoading = false } = {}) {
  const buttonText = isLoading ? 'Searching...' : 'Search Flights';
  const loadingAttributes = isLoading ? 'disabled aria-busy="true"' : 'aria-busy="false"';

  return `
    <main class="bg-slate-50 px-4 py-6 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <section class="mx-auto max-w-5xl">
        <div class="mb-5 grid gap-4 sm:mb-6 sm:grid-cols-[1fr_auto] sm:items-start">
          <div>
            <h1 class="text-2xl font-semibold tracking-normal text-slate-950 dark:text-slate-50 sm:text-3xl">
              Flight Search
            </h1>
            <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              Search flights with one mandatory stop.
            </p>
          </div>
          ${createThemeToggle(theme)}
        </div>

        <form class="grid gap-5 rounded border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900 sm:p-6 lg:gap-6" novalidate>
          ${createFieldError('route', errors)}

          ${createTripTypeControl(values.tripType)}

          <div class="grid gap-4 md:grid-cols-3">
            ${createTextField({
              id: 'from',
              label: 'From',
              value: values.from,
              errors,
              listId: 'airport-suggestions',
            })}
            ${createTextField({
              id: 'via',
              label: 'Via',
              value: values.via,
              errors,
              listId: 'airport-suggestions',
            })}
            ${createTextField({
              id: 'to',
              label: 'To',
              value: values.to,
              errors,
              listId: 'airport-suggestions',
            })}
            ${createAirportSuggestionsDatalist()}
          </div>

          <div class="grid gap-3">
            <p class="text-sm font-medium text-slate-700 dark:text-slate-300">Date Range</p>
            <div class="grid items-start gap-4 md:grid-cols-2">
              ${createDateField({
                id: 'dateRangeStart',
                label: 'Departure Date Start',
                value: values.dateRange.start,
                errors,
              })}
              ${createDateField({
                id: 'dateRangeEnd',
                label: 'Departure Date End',
                value: values.dateRange.end,
                errors,
              })}
            </div>
            ${createFieldError('dateRange', errors)}
          </div>

          ${createReturnDateRangeFields(values, errors)}

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
      </section>
    </main>
  `;
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

function createReturnDateRangeFields(values, errors) {
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
          errors,
        })}
        ${createDateField({
          id: 'returnDateRangeEnd',
          label: 'Return Date End',
          value: values.returnDateRange?.end ?? '',
          errors,
        })}
      </div>
      ${createFieldError('returnDateRange', errors)}
    </div>
  `;
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
