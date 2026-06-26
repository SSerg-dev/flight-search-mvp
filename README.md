# Flight Search Frontend MVP

Frontend MVP for searching flights with one mandatory stop.

## Stack

- Vite
- Vanilla JavaScript
- Tailwind CSS

## Current Wave

MVP v3: SerpApi-only provider cleanup.

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

SerpApi Google Flights is the active MVP provider. Mock mode remains the default local/test path.

Server-side SerpApi proxy configuration:

```text
SERPAPI_API_KEY=your-server-side-serpapi-key
SERPAPI_API_BASE_URL=https://serpapi.com
```

The proxy endpoint in `api/serpapi-flights.js` accepts the frontend SerpApi proxy payload, calls SerpApi Google Flights with server-side credentials, and returns provider results for frontend normalization. During local Vite development, `vite.config.js` wires `/api/serpapi-flights` to the same serverless handler.
