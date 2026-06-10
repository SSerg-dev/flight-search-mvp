# 03-03 Airport Metadata Boundary - Flight Search MVP v3

## Purpose

This document defines how MVP v3 uses airport metadata.

Airport metadata supports user input lookup, IATA code mapping, and display enrichment. It does not provide live fares, availability, schedules, booking, or operational status.

---

# Source Decision

```text
Airport metadata source: OurAirports local dataset
Flight offers source: Amadeus via backend/serverless proxy
```

MVP v3 uses an OurAirports-style local dataset first so airport lookup is deterministic, testable, and available without API keys.

---

# Boundary

```text
UI/search input
  -> airport metadata service
  -> normalized airport metadata
  -> later Amadeus proxy request mapping
```

The airport metadata service must:

- use local data only;
- avoid network calls;
- avoid secrets;
- return normalized airport records;
- support IATA lookup;
- support text search by city, airport name, country, and aliases;
- return empty results for unknown input.

The airport metadata service must not:

- call Amadeus directly;
- call a remote airport API;
- return live flight offers;
- handle booking, prices, or availability;
- mutate search query state.

---

# Normalized Airport Metadata Shape

```js
{
  id: 'bos-general-edward-lawrence-logan-international-airport',
  iata: 'BOS',
  name: 'General Edward Lawrence Logan International Airport',
  city: 'Boston',
  country: 'United States',
  latitude: 42.3643,
  longitude: -71.0052,
  aliases: ['Boston Logan', 'Logan Airport'],
}
```

Required fields:

- `id`
- `iata`
- `name`
- `city`
- `country`
- `latitude`
- `longitude`
- `aliases`

---

# MVP v3 Dataset Scope

Wave 7 starts with a small committed dataset for the known demo route:

- `BOS` - Boston Logan
- `IST` - Istanbul Airport
- `LED` - Pulkovo Airport, Saint Petersburg

Future waves may replace or generate this file from the full OurAirports CSV dataset without changing the service API.

---

# Status

```text
AIRPORT_METADATA_BOUNDARY_DEFINED
```
