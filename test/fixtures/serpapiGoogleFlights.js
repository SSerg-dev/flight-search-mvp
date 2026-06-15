export const serpapiGoogleFlightsFixture = {
  search_metadata: {
    status: 'Success',
  },
  best_flights: [
    {
      flights: [
        {
          departure_airport: {
            name: 'Logan International Airport',
            id: 'BOS',
            time: '2026-08-01 21:35',
          },
          arrival_airport: {
            name: 'Istanbul Airport',
            id: 'IST',
            time: '2026-08-02 14:25',
          },
          duration: 650,
          airline: 'Turkish Airlines',
          flight_number: 'TK 82',
        },
        {
          departure_airport: {
            name: 'Istanbul Airport',
            id: 'IST',
            time: '2026-08-02 18:55',
          },
          arrival_airport: {
            name: 'Pulkovo Airport',
            id: 'LED',
            time: '2026-08-03 02:15',
          },
          duration: 440,
          airline: 'Turkish Airlines',
          flight_number: 'TK 401',
        },
      ],
      layovers: [
        {
          duration: 270,
          name: 'Istanbul Airport',
          id: 'IST',
        },
      ],
      total_duration: 1360,
      price: 713,
      type: 'One way',
    },
  ],
  other_flights: [
    {
      flights: [
        {
          departure_airport: {
            name: 'Logan International Airport',
            id: 'BOS',
            time: '2026-08-01 08:00',
          },
          arrival_airport: {
            name: 'Heathrow Airport',
            id: 'LHR',
            time: '2026-08-01 20:00',
          },
          duration: 420,
          airline: 'British Airways',
          flight_number: 'BA 212',
        },
        {
          departure_airport: {
            name: 'Heathrow Airport',
            id: 'LHR',
            time: '2026-08-01 22:00',
          },
          arrival_airport: {
            name: 'Pulkovo Airport',
            id: 'LED',
            time: '2026-08-02 05:00',
          },
          duration: 240,
          airline: 'British Airways',
          flight_number: 'BA 878',
        },
      ],
      layovers: [
        {
          duration: 120,
          name: 'Heathrow Airport',
          id: 'LHR',
        },
      ],
      total_duration: 780,
      price: 640,
      type: 'One way',
    },
  ],
};
