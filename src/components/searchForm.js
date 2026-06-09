export const searchFormDefaults = {
  from: 'Boston',
  via: 'Istanbul',
  to: 'Saint Petersburg',
  departureDate: '2026-08-01',
  dateRange: {
    start: '2026-08-01',
    end: '2026-08-10',
  },
  adults: 2,
  minLayover: 3,
  maxLayover: 12,
};

const inputClass =
  'h-11 rounded border border-slate-300 bg-white px-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200';

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

function createTextField({ id, label, value, errors }) {
  return `
    <label class="grid gap-2 text-sm font-medium text-slate-700" for="${id}">
      <span class="block min-h-5">${label}</span>
      <input
        class="${inputClass}"
        id="${id}"
        name="${id}"
        type="text"
        value="${escapeHtml(value)}"
        ${createErrorAttributes(id, errors)}
      />
      ${createFieldError(id, errors)}
    </label>
  `;
}

function createNumberField({ id, label, value, min, errors }) {
  return `
    <label class="grid gap-2 text-sm font-medium text-slate-700" for="${id}">
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
    <label class="grid gap-2 text-sm font-medium text-slate-700" for="${id}">
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
  return {
    from: String(formData.get('from') ?? '').trim(),
    via: String(formData.get('via') ?? '').trim(),
    to: String(formData.get('to') ?? '').trim(),
    departureDate: String(formData.get('departureDate') ?? ''),
    dateRange: {
      start: String(formData.get('dateRangeStart') ?? ''),
      end: String(formData.get('dateRangeEnd') ?? ''),
    },
    adults: toOptionalNumber(formData.get('adults')),
    minLayover: toOptionalNumber(formData.get('minLayover')),
    maxLayover: toOptionalNumber(formData.get('maxLayover')),
  };
}

export function createSearchForm({ values = searchFormDefaults, errors = {} } = {}) {
  return `
    <main class="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <section class="mx-auto max-w-5xl">
        <div class="mb-5 sm:mb-6">
          <h1 class="text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">
            Flight Search
          </h1>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Search flights with one mandatory stop.
          </p>
        </div>

        <form class="grid gap-5 rounded border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:gap-6" novalidate>
          ${createFieldError('route', errors)}

          <div class="grid gap-4 md:grid-cols-3">
            ${createTextField({ id: 'from', label: 'From', value: values.from, errors })}
            ${createTextField({ id: 'via', label: 'Via', value: values.via, errors })}
            ${createTextField({ id: 'to', label: 'To', value: values.to, errors })}
          </div>

          <div class="grid gap-3">
            <p class="text-sm font-medium text-slate-700">Date Range</p>
            <div class="grid items-start gap-4 md:grid-cols-3">
              ${createDateField({
                id: 'departureDate',
                label: 'Departure Date',
                value: values.departureDate,
                errors,
              })}
              ${createDateField({
                id: 'dateRangeStart',
                label: 'Start Date',
                value: values.dateRange.start,
                errors,
              })}
              ${createDateField({
                id: 'dateRangeEnd',
                label: 'End Date',
                value: values.dateRange.end,
                errors,
              })}
            </div>
            ${createFieldError('dateRange', errors)}
          </div>

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
              class="h-11 w-full rounded bg-sky-600 px-5 text-sm font-semibold text-white transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 sm:w-auto"
              type="submit"
            >
              Search Flights
            </button>
          </div>
        </form>
      </section>
    </main>
  `;
}

function toOptionalNumber(value) {
  if (String(value ?? '').trim() === '') {
    return '';
  }

  return Number(value);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
