# Flight Search Frontend MVP

Frontend MVP for searching flights with one mandatory stop.

## Stack

- Vite
- Vanilla JavaScript
- Tailwind CSS

## Current Wave

MVP v3: Wave 10 — Backend/serverless proxy.

Automated verification:

- `npm test`
- `npm run build`

## Configuration

Local development and tests use mock flight data by default:

```text
VITE_FLIGHT_API_MODE=mock
```

Future real API mode must use a frontend-safe proxy URL:

```text
VITE_FLIGHT_API_MODE=amadeus
VITE_FLIGHT_API_PROXY_URL=/api/flights
```

Do not put Amadeus API keys, API secrets, bearer tokens, or access tokens in frontend `VITE_` variables. Real provider credentials belong behind a backend/serverless proxy.

Server-side proxy configuration:

```text
AMADEUS_CLIENT_ID=your-server-side-client-id
AMADEUS_CLIENT_SECRET=your-server-side-client-secret
AMADEUS_API_BASE_URL=https://test.api.amadeus.com
```

The proxy endpoint in `api/flights.js` accepts the frontend Amadeus proxy payload, obtains an Amadeus OAuth token server-side, calls Flight Offers Search with the resolved IATA route and mandatory stopover, then returns the provider response for frontend normalization.
