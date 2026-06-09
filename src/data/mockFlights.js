export const mockFlights = [
  {
    id: 'bos-ist-led-2026-08-01-tk',
    airline: {
      name: 'Turkish Airlines',
      code: 'TK',
      flightNumbers: ['TK82', 'TK401'],
    },
    price: {
      amount: 884,
      currency: 'USD',
      display: '$884',
      passengerCount: 2,
    },
    route: {
      origin: {
        city: 'Boston',
        airport: 'Boston Logan International',
        code: 'BOS',
      },
      stopover: {
        city: 'Istanbul',
        airport: 'Istanbul Airport',
        code: 'IST',
      },
      destination: {
        city: 'Saint Petersburg',
        airport: 'Pulkovo Airport',
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
        flightNumber: 'TK82',
      },
      {
        from: 'Istanbul',
        to: 'Saint Petersburg',
        departure: '2026-08-02 18:55',
        arrival: '2026-08-03 02:15',
        flightNumber: 'TK401',
      },
    ],
    duration: {
      totalMinutes: 1300,
      display: '21h 40m',
      layoverMinutes: 270,
      layoverDisplay: '4.5h layover',
    },
    availability: {
      seats: 5,
      canBookAdults: true,
    },
  },
  {
    id: 'bos-ist-led-2026-08-04-tk',
    airline: {
      name: 'Turkish Airlines',
      code: 'TK',
      flightNumbers: ['TK82', 'TK403'],
    },
    price: {
      amount: 932,
      currency: 'USD',
      display: '$932',
      passengerCount: 2,
    },
    route: {
      origin: {
        city: 'Boston',
        airport: 'Boston Logan International',
        code: 'BOS',
      },
      stopover: {
        city: 'Istanbul',
        airport: 'Istanbul Airport',
        code: 'IST',
      },
      destination: {
        city: 'Saint Petersburg',
        airport: 'Pulkovo Airport',
        code: 'LED',
      },
      departureDate: '2026-08-04',
    },
    segments: [
      {
        from: 'Boston',
        to: 'Istanbul',
        departure: '2026-08-04 22:10',
        arrival: '2026-08-05 15:05',
        flightNumber: 'TK82',
      },
      {
        from: 'Istanbul',
        to: 'Saint Petersburg',
        departure: '2026-08-05 22:05',
        arrival: '2026-08-06 04:05',
        flightNumber: 'TK403',
      },
    ],
    duration: {
      totalMinutes: 1375,
      display: '22h 55m',
      layoverMinutes: 420,
      layoverDisplay: '7h layover',
    },
    availability: {
      seats: 3,
      canBookAdults: true,
    },
  },
  {
    id: 'bos-ist-led-2026-08-08-tk',
    airline: {
      name: 'Turkish Airlines',
      code: 'TK',
      flightNumbers: ['TK84', 'TK405'],
    },
    price: {
      amount: 1018,
      currency: 'USD',
      display: '$1018',
      passengerCount: 2,
    },
    route: {
      origin: {
        city: 'Boston',
        airport: 'Boston Logan International',
        code: 'BOS',
      },
      stopover: {
        city: 'Istanbul',
        airport: 'Istanbul Airport',
        code: 'IST',
      },
      destination: {
        city: 'Saint Petersburg',
        airport: 'Pulkovo Airport',
        code: 'LED',
      },
      departureDate: '2026-08-08',
    },
    segments: [
      {
        from: 'Boston',
        to: 'Istanbul',
        departure: '2026-08-08 20:45',
        arrival: '2026-08-09 13:20',
        flightNumber: 'TK84',
      },
      {
        from: 'Istanbul',
        to: 'Saint Petersburg',
        departure: '2026-08-09 23:35',
        arrival: '2026-08-10 01:30',
        flightNumber: 'TK405',
      },
    ],
    duration: {
      totalMinutes: 1305,
      display: '21h 45m',
      layoverMinutes: 615,
      layoverDisplay: '10.25h layover',
    },
    availability: {
      seats: 2,
      canBookAdults: true,
    },
  },
  {
    id: 'bos-ist-led-2026-08-11-tk',
    airline: {
      name: 'Turkish Airlines',
      code: 'TK',
      flightNumbers: ['TK82', 'TK401'],
    },
    price: {
      amount: 876,
      currency: 'USD',
      display: '$876',
      passengerCount: 2,
    },
    route: {
      origin: {
        city: 'Boston',
        airport: 'Boston Logan International',
        code: 'BOS',
      },
      stopover: {
        city: 'Istanbul',
        airport: 'Istanbul Airport',
        code: 'IST',
      },
      destination: {
        city: 'Saint Petersburg',
        airport: 'Pulkovo Airport',
        code: 'LED',
      },
      departureDate: '2026-08-11',
    },
    segments: [
      {
        from: 'Boston',
        to: 'Istanbul',
        departure: '2026-08-11 21:35',
        arrival: '2026-08-12 14:25',
        flightNumber: 'TK82',
      },
      {
        from: 'Istanbul',
        to: 'Saint Petersburg',
        departure: '2026-08-12 18:55',
        arrival: '2026-08-13 02:15',
        flightNumber: 'TK401',
      },
    ],
    duration: {
      totalMinutes: 1300,
      display: '21h 40m',
      layoverMinutes: 270,
      layoverDisplay: '4.5h layover',
    },
    availability: {
      seats: 6,
      canBookAdults: true,
    },
  },
  {
    id: 'bos-lhr-led-2026-08-05-ba',
    airline: {
      name: 'British Airways',
      code: 'BA',
      flightNumbers: ['BA238', 'BA878'],
    },
    price: {
      amount: 798,
      currency: 'USD',
      display: '$798',
      passengerCount: 2,
    },
    route: {
      origin: {
        city: 'Boston',
        airport: 'Boston Logan International',
        code: 'BOS',
      },
      stopover: {
        city: 'London',
        airport: 'London Heathrow',
        code: 'LHR',
      },
      destination: {
        city: 'Saint Petersburg',
        airport: 'Pulkovo Airport',
        code: 'LED',
      },
      departureDate: '2026-08-05',
    },
    segments: [
      {
        from: 'Boston',
        to: 'London',
        departure: '2026-08-05 19:15',
        arrival: '2026-08-06 06:45',
        flightNumber: 'BA238',
      },
      {
        from: 'London',
        to: 'Saint Petersburg',
        departure: '2026-08-06 10:30',
        arrival: '2026-08-06 21:40',
        flightNumber: 'BA878',
      },
    ],
    duration: {
      totalMinutes: 1165,
      display: '19h 25m',
      layoverMinutes: 225,
      layoverDisplay: '3.75h layover',
    },
    availability: {
      seats: 4,
      canBookAdults: true,
    },
  },
];
