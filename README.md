# Flight Search Frontend MVP

Frontend MVP for searching flights with one mandatory stop.

## Stack

- Vite
- Vanilla JavaScript
- Tailwind CSS

## Current Wave

MVP v3: Wave 14 — Duffel local deployment wiring.

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
VITE_FLIGHT_API_MODE=duffel
VITE_FLIGHT_API_PROXY_URL=/api/duffel-flights
```

Do not put provider API keys, API secrets, bearer tokens, or access tokens in frontend `VITE_` variables. Real provider credentials belong behind a backend/serverless proxy.

Duffel is the preferred real flight provider after the Amadeus Self-Service portal decommissioning risk. Amadeus remains as a legacy/reference adapter path.

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
