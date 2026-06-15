import { createResultCard } from './resultCard.js';
import { sortFlights } from '../utils/sortFlights.js';

export function createRoundTripResultsList(results = {}, { sortBy = 'price' } = {}) {
  const pairs = createRoundTripPairs(results, sortBy);

  if (pairs.length === 0) {
    return `
      <section class="mx-auto mt-6 max-w-5xl rounded border border-dashed border-slate-300 bg-white p-6 text-center sm:p-8" aria-live="polite">
        <h2 class="text-lg font-semibold text-slate-950">No matching round-trip pairs found</h2>
        <p class="mt-2 text-sm text-slate-600">Try changing the date ranges or layover hours.</p>
      </section>
    `;
  }

  return `
    <section class="mx-auto mt-6 grid max-w-5xl gap-4 px-4 sm:px-0" aria-live="polite">
      <div class="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <h2 class="text-xl font-semibold text-slate-950">Round-trip options</h2>
          <p class="mt-1 text-sm text-slate-600">Each option pairs one outbound flight with one return flight.</p>
        </div>
        <label class="grid gap-1 text-sm font-medium text-slate-700" for="sortBy">
          Sort results
          <select
            class="h-10 rounded border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            id="sortBy"
            name="sortBy"
          >
            <option value="price"${createSelectedAttribute(sortBy, 'price')}>Sort by price</option>
            <option value="duration"${createSelectedAttribute(sortBy, 'duration')}>Sort by duration</option>
          </select>
        </label>
      </div>
      <div class="grid gap-4">
        ${pairs.map((pair, index) => createRoundTripPairRow(pair, index)).join('')}
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

function createRoundTripPairs(results, sortBy) {
  const outbound = sortFlights(getArray(results.outbound), sortBy);
  const returnFlights = sortFlights(getArray(results.return), sortBy);
  const pairCount = Math.min(outbound.length, returnFlights.length);
  const pairs = [];

  for (let index = 0; index < pairCount; index += 1) {
    pairs.push({
      outbound: outbound[index],
      return: returnFlights[index],
    });
  }

  return sortRoundTripPairs(pairs, sortBy);
}

function sortRoundTripPairs(pairs, sortBy) {
  if (sortBy === 'duration') {
    return [...pairs].sort((left, right) => getPairDuration(left) - getPairDuration(right));
  }

  return [...pairs].sort((left, right) => getPairPrice(left) - getPairPrice(right));
}

function createRoundTripPairRow(pair, index) {
  return `
    <article class="grid gap-4 rounded border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div class="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-start">
        <div>
          <h3 class="text-lg font-semibold text-slate-950">Option ${index + 1}</h3>
          <p class="mt-1 text-sm text-slate-600">Outbound flight + return flight</p>
        </div>
        <div class="text-left sm:text-right">
          <p class="text-sm font-medium text-slate-600">Total estimated price</p>
          <p class="text-2xl font-semibold text-slate-950">${formatPairPrice(pair)}</p>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        ${createLabeledFlightCard('Outbound flight', pair.outbound)}
        ${createLabeledFlightCard('Return flight', pair.return)}
      </div>
    </article>
  `;
}

function createLabeledFlightCard(label, flight) {
  return `
    <div class="grid gap-2">
      <p class="text-sm font-semibold text-slate-700">${label}</p>
      ${createResultCard(flight)}
    </div>
  `;
}

function getPairPrice(pair) {
  return Number(pair.outbound?.price?.amount ?? 0) + Number(pair.return?.price?.amount ?? 0);
}

function getPairDuration(pair) {
  return Number(pair.outbound?.duration?.totalMinutes ?? 0) + Number(pair.return?.duration?.totalMinutes ?? 0);
}

function formatPairPrice(pair) {
  const currency = pair.outbound?.price?.currency;
  const total = getPairPrice(pair);

  if (currency === 'USD') {
    return `$${total}`;
  }

  return `${total} ${currency || ''}`.trim();
}

function getArray(value) {
  return Array.isArray(value) ? value : [];
}
