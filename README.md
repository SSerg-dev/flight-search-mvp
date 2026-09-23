# Flight Search Frontend MVP

Frontend MVP for searching flights between specific passenger airports, optionally through a selected airport.

## Stack

- Vite
- Vanilla JavaScript
- Tailwind CSS

## Current Wave

MVP v3: SerpApi-only provider cleanup.

## Features

- One-way and round-trip searches with dynamically discovered direct and one-stop route options.
- City-wide endpoints such as `Moscow — All airports`, while preserving exact-airport selection.
- Results grouped with direct flights first, followed by available connection airports.
- Searchable, keyboard-accessible airport comboboxes match city, country, airport name, IATA code, and available local aliases.
- Selected airports are stored by stable dataset ID while their readable city labels remain compatible with the flight providers.
- Departure dates must be valid future dates, and displayed flights must arrive after departure and after the current date.
- Date range, passenger count, and layover hour filtering.
- Recent valid searches are saved in browser `localStorage`, capped to the newest five, and can be restored into the form.
- Light and dark theme toggle saved in browser `localStorage`.

Automated verification:

- `npm test`
- `npm run build`

## Airport data

`src/data/airports.js` is a local index of scheduled passenger airports with IATA codes. It is generated from the public-domain [OurAirports](https://ourairports.com/data/) dataset, so the form does not need a network request while the user types.

Refresh the index when airport metadata changes:

```text
npm run airports:update
```

The generator keeps the persistent OurAirports ID, IATA and ICAO codes, airport and municipality names, country, coordinates, aliases, and airport type. The generated file should be committed with the application.

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
