export const realisticNormalizedFlightOffer = {
  id: 'normalized-realistic-offer',
  airline: {
    name: 'Very Long International Airways & Partners',
    code: 'VL',
    flightNumbers: ['VL1234', 'VL9876'],
  },
  price: {
    amount: 1042.5,
    currency: 'EUR',
    display: '1042.5 EUR',
    passengerCount: 2,
  },
  route: {
    origin: {
      city: 'Boston',
      airport: 'Boston Logan International Airport Terminal E',
      code: 'BOS',
    },
    stopover: {
      city: 'Istanbul',
      airport: 'Istanbul Airport International Transfer Terminal',
      code: 'IST',
    },
    destination: {
      city: 'Saint Petersburg',
      airport: 'Pulkovo Airport International Terminal',
      code: 'LED',
    },
    departureDate: '2026-08-01',
  },
  segments: [
    {
      from: 'Boston',
      to: 'Istanbul',
      departure: '2026-08-01 21:35',
      arrival: '2026-08-02 14:25',
      flightNumber: 'VL1234',
    },
    {
      from: 'Istanbul',
      to: 'Saint Petersburg',
      departure: '2026-08-02 18:55',
      arrival: '2026-08-03 02:15',
      flightNumber: 'VL9876',
    },
  ],
  duration: {
    totalMinutes: 1300,
    display: '21h 40m',
    layoverMinutes: 270,
    layoverDisplay: '4.5h layover',
  },
  availability: {
    seats: 2,
    canBookAdults: true,
  },
};

export const missingOptionalNormalizedFlightOffer = {
  ...realisticNormalizedFlightOffer,
  id: 'normalized-missing-optional-offer',
  airline: {
    name: 'Unknown airline',
    code: '',
    flightNumbers: [],
  },
  price: {
    amount: 0,
    currency: 'USD',
    display: '',
    passengerCount: 2,
  },
  duration: {
    totalMinutes: 0,
    display: '',
    layoverMinutes: 0,
    layoverDisplay: '',
  },
};
