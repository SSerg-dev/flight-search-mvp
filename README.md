# Flight Search Frontend MVP

Frontend MVP for searching flights with one mandatory stop.

## Stack

- Vite
- Vanilla JavaScript
- Tailwind CSS

## Current Wave

MVP v3: Wave 15 — SerpApi Google Flights provider wiring.

Automated verification:

- `npm test`
- `npm run build`

## Configuration

Local development and tests use mock flight data by default:

```text
VITE_FLIGHT_API_MODE=mock
```

Real API mode must use a frontend-safe proxy URL:

```text
VITE_FLIGHT_API_MODE=serpapi
VITE_FLIGHT_API_PROXY_URL=/api/serpapi-flights
```

Do not put provider API keys, API secrets, bearer tokens, or access tokens in frontend `VITE_` variables. Real provider credentials belong behind a backend/serverless proxy.

SerpApi Google Flights is the preferred free-tier MVP provider. Duffel and Amadeus remain as legacy/reference adapter paths.

Server-side SerpApi proxy configuration:

```text
SERPAPI_API_KEY=your-server-side-serpapi-key
SERPAPI_API_BASE_URL=https://serpapi.com
```

The proxy endpoint in `api/serpapi-flights.js` accepts the frontend SerpApi proxy payload, calls SerpApi Google Flights with server-side credentials, and returns provider results for frontend normalization. During local Vite development, `vite.config.js` wires `/api/serpapi-flights` to the same serverless handler.

Server-side Duffel proxy configuration:

```text
DUFFEL_ACCESS_TOKEN=your-server-side-duffel-token
DUFFEL_API_BASE_URL=https://api.duffel.com
```

The proxy endpoint in `api/duffel-flights.js` accepts the frontend Duffel proxy payload, calls Duffel Offer Requests with server-side credentials, preserves the mandatory stopover as two slices, and returns the provider response for frontend normalization.

During local Vite development, `vite.config.js` wires `/api/duffel-flights` to the same serverless handler so the frontend can call the Duffel proxy path without a separate backend process.

Legacy Amadeus proxy configuration:

```text
AMADEUS_CLIENT_ID=your-server-side-client-id
AMADEUS_CLIENT_SECRET=your-server-side-client-secret
AMADEUS_API_BASE_URL=https://test.api.amadeus.com
```

The legacy Amadeus proxy endpoint in `api/flights.js` accepts the frontend Amadeus proxy payload, obtains an Amadeus OAuth token server-side, calls Flight Offers Search with the resolved IATA route and mandatory stopover, then returns the provider response for frontend normalization.
