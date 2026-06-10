export const amadeusFlightOffersFixture = {
  data: [
    {
      id: 'amadeus-offer-1',
      numberOfBookableSeats: 4,
      itineraries: [
        {
          duration: 'PT21H40M',
          segments: [
            {
              departure: {
                iataCode: 'BOS',
                terminal: 'E',
                at: '2026-08-01T21:35:00',
              },
              arrival: {
                iataCode: 'IST',
                at: '2026-08-02T14:25:00',
              },
              carrierCode: 'TK',
              number: '82',
              duration: 'PT9H50M',
            },
            {
              departure: {
                iataCode: 'IST',
                at: '2026-08-02T18:55:00',
              },
              arrival: {
                iataCode: 'LED',
                at: '2026-08-03T02:15:00',
              },
              carrierCode: 'TK',
              number: '401',
              duration: 'PT3H20M',
            },
          ],
        },
      ],
      price: {
        currency: 'USD',
        grandTotal: '884.00',
      },
      travelerPricings: [{ travelerId: '1' }, { travelerId: '2' }],
    },
  ],
  dictionaries: {
    carriers: {
      TK: 'Turkish Airlines',
    },
    locations: {
      BOS: {
        cityCode: 'BOS',
        detailedName: 'Boston Logan International',
      },
      IST: {
        cityCode: 'IST',
        detailedName: 'Istanbul Airport',
      },
      LED: {
        cityCode: 'LED',
        detailedName: 'Pulkovo Airport',
      },
    },
  },
};

export const amadeusMissingOptionalFieldsFixture = {
  data: [
    {
      id: 'amadeus-offer-missing-optional',
      itineraries: [
        {
          duration: 'PT19H',
          segments: [
            {
              departure: {
                iataCode: 'BOS',
                at: '2026-08-04T22:10:00',
              },
              arrival: {
                iataCode: 'IST',
                at: '2026-08-05T15:05:00',
              },
              carrierCode: 'TK',
              number: '82',
            },
            {
              departure: {
                iataCode: 'IST',
                at: '2026-08-05T22:05:00',
              },
              arrival: {
                iataCode: 'LED',
                at: '2026-08-06T04:05:00',
              },
              carrierCode: 'TK',
              number: '403',
            },
          ],
        },
      ],
      price: {},
    },
  ],
};
