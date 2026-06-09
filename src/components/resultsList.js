import { createResultCard } from './resultCard.js';

export function createResultsList(flights = []) {
  if (flights.length === 0) {
    return `
      <section class="mx-auto mt-6 max-w-5xl rounded border border-dashed border-slate-300 bg-white p-6 text-center sm:p-8" aria-live="polite">
        <h2 class="text-lg font-semibold text-slate-950">No matching flights found</h2>
        <p class="mt-2 text-sm text-slate-600">Try changing the date range or layover hours.</p>
      </section>
    `;
  }

  return `
    <section class="mx-auto mt-6 grid max-w-5xl gap-4 px-4 sm:px-0" aria-live="polite">
      <div>
        <h2 class="text-xl font-semibold text-slate-950">${flights.length} matching flights</h2>
        <p class="mt-1 text-sm text-slate-600">Prices are mock USD estimates for the selected route.</p>
      </div>
      <div class="grid gap-4">
        ${flights.map((flight) => createResultCard(flight)).join('')}
      </div>
    </section>
  `;
}
