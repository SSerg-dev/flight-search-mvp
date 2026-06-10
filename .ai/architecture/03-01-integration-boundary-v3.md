# 03-01 Integration Boundary — Flight Search MVP v3

## Purpose

This document defines where provider-specific flight API logic belongs in MVP v3.

The goal is to integrate real flight data without coupling UI components to Amadeus or any other provider response shape.

---

# Approved Boundary

```text
UI
↓
src/services/flightService.js
↓
adapter selection
↓
mock adapter OR real provider adapter
↓
normalization layer
↓
normalized flight offers
```

---

# Local And Test Mode

```text
browser -> mock adapter -> normalized flight offers
```

Local and test mode must continue to work without:

- API credentials;
- network calls;
- backend/serverless proxy;
- live provider availability.

---

# Real API Mode

```text
browser -> backend/serverless proxy -> Amadeus API
```

Frontend real mode may call only the backend/serverless proxy.

The frontend must not call Amadeus directly with secret credentials.

---

# Module Direction

Target modules:

```text
src/services/flightService.js
src/services/adapters/mockFlightAdapter.js
src/services/adapters/amadeusFlightAdapter.js
src/services/normalizers/amadeusFlightNormalizer.js
src/config/apiConfig.js
```

The UI-facing service contract remains:

```text
searchFlightOffers(query, options?) -> Promise<normalizedFlightOffers>
```

---

# UI Rules

UI components must consume normalized flight offers only.

UI components must not:

- import Amadeus modules;
- read raw Amadeus response fields;
- know which provider produced the result;
- render raw provider errors;
- require live API credentials to render.

---

# Adapter Rules

Adapters are responsible for data source details.

Mock adapter responsibilities:

- keep existing mock search behavior;
- support local development and tests;
- preserve simulated async behavior;
- preserve controllable failure behavior for tests.

Amadeus adapter responsibilities:

- call the frontend-safe proxy client;
- never contain real provider secrets;
- convert proxy/provider responses through the normalizer;
- throw or return controlled service errors.

---

# Normalizer Rules

Provider data must be normalized before it reaches UI code.

The normalizer maps provider-specific data into:

```text
id
airline
price
route
segments
duration
availability
```

---

# Status

```text
INTEGRATION_BOUNDARY_DEFINED
```
