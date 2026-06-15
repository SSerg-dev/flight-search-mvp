import assert from 'node:assert/strict';
import test from 'node:test';

import { createRoundTripResultsList } from '../src/components/roundTripResultsList.js';

const cheapOutbound = createFlight({
  id: 'cheap-outbound',
  airlineName: 'Cheap outbound',
  amount: 200,
  totalMinutes: 600,
  origin: 'Boston',
  stopover: 'Istanbul',
  destination: 'Saint Petersburg',
  departureDate: '2026-08-01',
});

const expensiveOutbound = createFlight({
  id: 'expensive-outbound',
  airlineName: 'Expensive outbound',
  amount: 900,
  totalMinutes: 400,
  origin: 'Boston',
  stopover: 'Istanbul',
  destination: 'Saint Petersburg',
  departureDate: '2026-08-02',
});

const cheapReturn = createFlight({
  id: 'cheap-return',
  airlineName: 'Cheap return',
  amount: 300,
  totalMinutes: 700,
  origin: 'Saint Petersburg',
  stopover: 'Istanbul',
  destination: 'Boston',
  departureDate: '2026-08-20',
});

const expensiveReturn = createFlight({
  id: 'expensive-return',
  airlineName: 'Expensive return',
  amount: 800,
  totalMinutes: 300,
  origin: 'Saint Petersburg',
  stopover: 'Istanbul',
  destination: 'Boston',
  departureDate: '2026-08-21',
});

test('round-trip results render paired outbound and return cards with a combined price', () => {
  const markup = createRoundTripResultsList({
    outbound: [cheapOutbound],
    return: [cheapReturn],
  });

  assert.match(markup, /Round-trip options/);
  assert.match(markup, /Option 1/);
  assert.match(markup, /Outbound flight/);
  assert.match(markup, /Return flight/);
  assert.match(markup, /Cheap outbound/);
  assert.match(markup, /Cheap return/);
  assert.match(markup, /Total estimated price/);
  assert.match(markup, /\$500/);
});

test('round-trip results pair flights by index after sorting each side by price', () => {
  const markup = createRoundTripResultsList({
    outbound: [expensiveOutbound, cheapOutbound],
    return: [expensiveReturn, cheapReturn],
  });

  assert.match(markup, /Option 1[\s\S]*Cheap outbound[\s\S]*Cheap return/);
  assert.match(markup, /Option 2[\s\S]*Expensive outbound[\s\S]*Expensive return/);
});

test('round-trip results can sort pairs by combined duration', () => {
  const markup = createRoundTripResultsList(
    {
      outbound: [cheapOutbound, expensiveOutbound],
      return: [cheapReturn, expensiveReturn],
    },
    { sortBy: 'duration' },
  );

  assert.match(markup, /Option 1[\s\S]*Expensive outbound[\s\S]*Expensive return/);
});

test('round-trip results ignore unpaired extra flights', () => {
  const markup = createRoundTripResultsList({
    outbound: [cheapOutbound, expensiveOutbound],
    return: [cheapReturn],
  });

  assert.match(markup, /Option 1/);
  assert.doesNotMatch(markup, /Option 2/);
});

test('round-trip results render an empty state when either side has no pair', () => {
  const markup = createRoundTripResultsList({
    outbound: [cheapOutbound],
    return: [],
  });

  assert.match(markup, /No matching round-trip pairs found/);
});

test('round-trip pair rows use two columns on desktop and stack on mobile', () => {
  const markup = createRoundTripResultsList({
    outbound: [cheapOutbound],
    return: [cheapReturn],
  });

  assert.match(markup, /grid-cols-1/);
  assert.match(markup, /lg:grid-cols-2/);
});

test('round-trip results render an accessible sorting dropdown', () => {
  const markup = createRoundTripResultsList(
    {
      outbound: [cheapOutbound],
      return: [cheapReturn],
    },
    { sortBy: 'duration' },
  );

  assert.match(markup, /<label[\s\S]*for="sortBy"[\s\S]*Sort results/);
  assert.match(markup, /name="sortBy"/);
  assert.match(markup, /Sort by price/);
  assert.match(markup, /Sort by duration/);
  assert.match(markup, /value="duration" selected/);
});

function createFlight({ id, airlineName, amount, totalMinutes, origin, stopover, destination, departureDate }) {
  return {
    id,
    airline: {
      name: airlineName,
      code: airlineName.slice(0, 2).toUpperCase(),
      flightNumbers: [`${airlineName.slice(0, 2).toUpperCase()}1`],
    },
    price: {
      amount,
      currency: 'USD',
      display: `$${amount}`,
      passengerCount: 2,
    },
    route: {
      origin: {
        city: origin,
        airport: `${origin} Airport`,
        code: origin.slice(0, 3).toUpperCase(),
      },
      stopover: {
        city: stopover,
        airport: `${stopover} Airport`,
        code: stopover.slice(0, 3).toUpperCase(),
      },
      destination: {
        city: destination,
        airport: `${destination} Airport`,
        code: destination.slice(0, 3).toUpperCase(),
      },
      departureDate,
    },
    segments: [
      {
        from: origin,
        to: stopover,
        departure: `${departureDate} 10:00`,
        arrival: `${departureDate} 14:00`,
        flightNumber: `${airlineName.slice(0, 2).toUpperCase()}1`,
      },
      {
        from: stopover,
        to: destination,
        departure: `${departureDate} 18:00`,
        arrival: `${departureDate} 22:00`,
        flightNumber: `${airlineName.slice(0, 2).toUpperCase()}2`,
      },
    ],
    duration: {
      totalMinutes,
      display: `${Math.floor(totalMinutes / 60)}h`,
      layoverMinutes: 240,
      layoverDisplay: '4h layover',
    },
    availability: {
      seats: 2,
      canBookAdults: true,
    },
  };
}
