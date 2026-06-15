import { createResultCard } from './resultCard.js';

export function createResultsList(
  flights = [],
  { sortBy = 'price', query, title, dateRangeLabel = 'Departures', sortControlId = 'sortBy' } = {},
) {
  if (flights.length === 0) {
    return `
      <section class="mx-auto mt-6 max-w-5xl rounded border border-dashed border-slate-300 bg-white p-6 text-center sm:p-8" aria-live="polite">
        ${title ? `<p class="mb-2 text-sm font-semibold text-slate-700">${escapeHtml(title)}</p>` : ''}
        <h2 class="text-lg font-semibold text-slate-950">No matching flights found</h2>
        <p class="mt-2 text-sm text-slate-600">Try changing the date range or layover hours.</p>
      </section>
    `;
  }

  return `
    <section class="mx-auto mt-6 grid max-w-5xl gap-4 px-4 sm:px-0" aria-live="polite">
      <div class="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <h2 class="text-xl font-semibold text-slate-950">${escapeHtml(title ?? `${flights.length} matching ${flights.length === 1 ? 'flight' : 'flights'}`)}</h2>
          <p class="mt-1 text-sm text-slate-600">Prices are estimates for the selected route.</p>
          ${createDateRangeSummary(query, dateRangeLabel)}
        </div>
        <label class="grid gap-1 text-sm font-medium text-slate-700" for="${escapeHtml(sortControlId)}">
          Sort results
          <select
            class="h-10 rounded border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            id="${escapeHtml(sortControlId)}"
            name="sortBy"
          >
            <option value="price"${createSelectedAttribute(sortBy, 'price')}>Sort by price</option>
            <option value="duration"${createSelectedAttribute(sortBy, 'duration')}>Sort by duration</option>
          </select>
        </label>
      </div>
      <div class="grid gap-4">
        ${flights.map((flight) => createResultCard(flight)).join('')}
      </div>
    </section>
  `;
}

function createSelectedAttribute(currentValue, optionValue) {
  if (currentValue !== optionValue) {
    return '';
  }

  return ' selected';
}

function createDateRangeSummary(query, label) {
  const start = query?.dateRange?.start;
  const end = query?.dateRange?.end;

  if (!hasText(start) || !hasText(end)) {
    return '';
  }

  return `<p class="mt-1 text-sm font-medium text-slate-700">${escapeHtml(label)} from ${escapeHtml(start)} to ${escapeHtml(end)}</p>`;
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
