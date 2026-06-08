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

function createTextField({ id, label, value }) {
  return `
    <label class="grid gap-2 text-sm font-medium text-slate-700" for="${id}">
      ${label}
      <input
        class="h-11 rounded border border-slate-300 bg-white px-3 text-base text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        id="${id}"
        name="${id}"
        type="text"
        value="${value}"
      />
    </label>
  `;
}

function createNumberField({ id, label, value, min }) {
  return `
    <label class="grid gap-2 text-sm font-medium text-slate-700" for="${id}">
      ${label}
      <input
        class="h-11 rounded border border-slate-300 bg-white px-3 text-base text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        id="${id}"
        name="${id}"
        type="number"
        min="${min}"
        value="${value}"
      />
    </label>
  `;
}

function createDateField({ id, label, value }) {
  return `
    <label class="grid gap-2 text-sm font-medium text-slate-700" for="${id}">
      ${label}
      <input
        class="h-11 rounded border border-slate-300 bg-white px-3 text-base text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        id="${id}"
        name="${id}"
        type="date"
        value="${value}"
      />
    </label>
  `;
}

export function createSearchForm() {
  return `
    <main class="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <section class="mx-auto max-w-5xl">
        <div class="mb-6">
          <h1 class="text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">
            Flight Search
          </h1>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Search flights with one mandatory stop.
          </p>
        </div>

        <form class="grid gap-6 rounded border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div class="grid gap-4 md:grid-cols-3">
            ${createTextField({ id: 'from', label: 'From', value: searchFormDefaults.from })}
            ${createTextField({ id: 'via', label: 'Via', value: searchFormDefaults.via })}
            ${createTextField({ id: 'to', label: 'To', value: searchFormDefaults.to })}
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            ${createDateField({
              id: 'departureDate',
              label: 'Departure Date',
              value: searchFormDefaults.departureDate,
            })}

            <fieldset class="grid gap-2">
              <legend class="mb-2 text-sm font-medium text-slate-700">Date Range</legend>
              <div class="grid gap-3 sm:grid-cols-2">
                ${createDateField({
                  id: 'dateRangeStart',
                  label: 'Start Date',
                  value: searchFormDefaults.dateRange.start,
                })}
                ${createDateField({
                  id: 'dateRangeEnd',
                  label: 'End Date',
                  value: searchFormDefaults.dateRange.end,
                })}
              </div>
            </fieldset>
          </div>

          <div class="grid gap-4 md:grid-cols-3">
            ${createNumberField({
              id: 'adults',
              label: 'Adults',
              min: 1,
              value: searchFormDefaults.adults,
            })}
            ${createNumberField({
              id: 'minLayover',
              label: 'Min Layover Hours',
              min: 0,
              value: searchFormDefaults.minLayover,
            })}
            ${createNumberField({
              id: 'maxLayover',
              label: 'Max Layover Hours',
              min: 0,
              value: searchFormDefaults.maxLayover,
            })}
          </div>

          <div class="flex justify-start">
            <button
              class="h-11 rounded bg-sky-600 px-5 text-sm font-semibold text-white transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-300"
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
