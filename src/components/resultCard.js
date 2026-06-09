export function createResultCard(flight) {
  return `
    <article class="grid gap-4 rounded border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[1fr_auto] sm:items-start sm:p-5">
      <div class="grid gap-3">
        <div>
          <h2 class="text-lg font-semibold text-slate-950">${escapeHtml(flight.airline)}</h2>
          <p class="mt-1 text-sm text-slate-600">${escapeHtml(flight.flightNumbers.join(' / '))}</p>
        </div>

        <div class="grid gap-2 text-sm text-slate-700">
          <p class="font-medium text-slate-900">
            ${escapeHtml(flight.from)} -> ${escapeHtml(flight.via)} -> ${escapeHtml(flight.to)}
          </p>
          <p>
            Depart ${escapeHtml(flight.departureDate)} at ${escapeHtml(flight.departureTime)}
            · Arrive ${escapeHtml(flight.arrivalDate)} at ${escapeHtml(flight.arrivalTime)}
          </p>
          <p>
            ${escapeHtml(flight.layoverHours)}h layover in ${escapeHtml(flight.via)}
            · ${escapeHtml(flight.totalDuration)} total
          </p>
        </div>
      </div>

      <div class="grid gap-1 text-left sm:text-right">
        <p class="text-2xl font-semibold text-slate-950">$${escapeHtml(flight.price)}</p>
        <p class="text-sm text-slate-600">
          ${escapeHtml(flight.currency)} total for ${escapeHtml(flight.pricedForAdults)} adults
        </p>
      </div>
    </article>
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
