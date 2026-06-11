export const duffelOfferRequestFixture = {
  data: {
    id: 'orq_0000duffel',
    offers: [
      {
        id: 'off_0000duffel',
        total_amount: '912.40',
        total_currency: 'USD',
        slices: [
          {
            segments: [
              {
                origin: {
                  iata_code: 'BOS',
                  city_name: 'Boston',
                  name: 'Logan International Airport',
                },
                destination: {
                  iata_code: 'IST',
                  city_name: 'Istanbul',
                  name: 'Istanbul Airport',
                },
                departing_at: '2026-08-01T21:35:00',
                arriving_at: '2026-08-02T14:25:00',
                marketing_carrier: {
                  iata_code: 'TK',
                  name: 'Turkish Airlines',
                },
                marketing_carrier_flight_number: '82',
              },
              {
                origin: {
                  iata_code: 'IST',
                  city_name: 'Istanbul',
                  name: 'Istanbul Airport',
                },
                destination: {
                  iata_code: 'LED',
                  city_name: 'Saint Petersburg',
                  name: 'Pulkovo Airport',
                },
                departing_at: '2026-08-02T18:55:00',
                arriving_at: '2026-08-03T02:15:00',
                marketing_carrier: {
                  iata_code: 'TK',
                  name: 'Turkish Airlines',
                },
                marketing_carrier_flight_number: '401',
              },
            ],
          },
        ],
        passengers: [
          {
            id: 'pas_1',
            type: 'adult',
          },
          {
            id: 'pas_2',
            type: 'adult',
          },
        ],
      },
    ],
  },
};
