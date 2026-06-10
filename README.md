# Flight Search Frontend MVP

Frontend MVP for searching flights with one mandatory stop.

## Stack

- Vite
- Vanilla JavaScript
- Tailwind CSS

## Current Wave

MVP v3: Wave 2 — Environment and Configuration.

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
VITE_FLIGHT_API_PROXY_URL=https://your-proxy.example.com/api/flights
```

Do not put Amadeus API keys, API secrets, bearer tokens, or access tokens in frontend `VITE_` variables. Real provider credentials belong behind a backend/serverless proxy.
