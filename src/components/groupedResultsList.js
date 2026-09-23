import { createResultCard } from './resultCard.js';
import { groupFlightsByConnection } from '../utils/flightConnections.js';
import { sortFlights } from '../utils/sortFlights.js';

export function createGroupedResultsList(flights = [], { sortBy = 'price', query } = {}) {
  if (flights.length === 0) {
    return createEmptyState();
  }

  const groups = groupFlightsByConnection(sortFlights(flights, sortBy));

  return `
    <section class="mx-auto mt-6 grid max-w-5xl gap-5 px-4 sm:px-0" aria-live="polite">
      <div class="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <h2 class="text-xl font-semibold text-slate-950 dark:text-slate-100">${flights.length} matching ${flights.length === 1 ? 'flight' : 'flights'}</h2>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">Direct flights are shown first, followed by available connection airports.</p>
          ${createDateRangeSummary(query)}
        </div>
        ${createSortControl(sortBy)}
      </div>
      ${groups.map(createConnectionGroup).join('')}
    </section>
  `;
}

function createConnectionGroup(group) {
  return `
      <section class="grid gap-3" data-connection-group="${escapeHtml(group.key)}">
        <div class="flex items-center justify-between gap-3 border-b border-slate-200 pb-2 dark:border-slate-700">
          <h3 class="text-lg font-semibold text-slate-950 dark:text-slate-100">${escapeHtml(group.label)}</h3>
          <span class="text-sm text-slate-500 dark:text-slate-400">${group.flights.length} ${group.flights.length === 1 ? 'option' : 'options'}</span>
        </div>
        <div class="grid gap-4">
          ${group.flights.map((flight) => createResultCard(flight)).join('')}
        </div>
      </section>
  `;
}

function createSortControl(sortBy) {
  return `
        <label class="grid gap-1 text-sm font-medium text-slate-700 dark:text-slate-300" for="sortBy">
          Sort results
          <select class="h-10 rounded border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" id="sortBy" name="sortBy">
            <option value="price"${sortBy === 'price' ? ' selected' : ''}>Sort by price</option>
            <option value="duration"${sortBy === 'duration' ? ' selected' : ''}>Sort by duration</option>
          </select>
        </label>
  `;
}

function createDateRangeSummary(query) {
  const start = query?.dateRange?.start;
  const end = query?.dateRange?.end;

  if (!start || !end) return '';

  return `<p class="mt-1 text-sm font-medium text-slate-700 dark:text-slate-300">Departures from ${escapeHtml(start)} to ${escapeHtml(end)}</p>`;
}

function createEmptyState() {
  return `
    <section class="mx-auto mt-6 max-w-5xl rounded border border-dashed border-slate-300 bg-white p-6 text-center dark:border-slate-700 dark:bg-slate-900 sm:p-8" aria-live="polite">
      <h2 class="text-lg font-semibold text-slate-950 dark:text-slate-100">No matching flights found</h2>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">Try changing the date range, destination airport, or layover hours.</p>
    </section>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
