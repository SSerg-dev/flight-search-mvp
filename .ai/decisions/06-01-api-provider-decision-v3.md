# 06-01 API Provider Decision — Flight Search MVP v3

## Purpose

This document records the approved provider direction for MVP v3.

MVP v3 introduces real flight API integration planning while keeping mock mode available for local development and tests.

---

# Decision

Preferred first provider:

```text
Amadeus Self-Service APIs
```

Secondary provider:

```text
Duffel API
```

Deferred provider category:

```text
Schedule/status-oriented APIs
```

---

# Why Amadeus First

Amadeus is the preferred first provider because it fits the MVP v3 search-only goal:

- supports flight offer search;
- supports city/airport origin and destination search patterns;
- supports adult traveler count;
- supports test-oriented developer flow;
- has documentation suitable for an incremental integration;
- maps reasonably well to the existing normalized flight result shape.

Amadeus should be used first for search and offer data only.

---

# Why Duffel Is Secondary

Duffel is a strong booking-grade flight retailing API, but it is heavier than MVP v3 currently needs.

Duffel should remain a secondary option for a future product direction that includes:

- booking;
- orders;
- payments;
- ancillaries;
- post-booking flows.

MVP v3 does not include those features.

---

# Why Schedule/Status APIs Are Deferred

Schedule/status-oriented APIs are not a primary fit for MVP v3 because the application needs fare offer search data.

The MVP v3 search flow needs:

- prices;
- itinerary segments;
- passenger count support;
- route data;
- layover information;
- offer-like results.

Schedule/status APIs may be useful later for metadata or operational data, but they should not drive real flight offer search.

---

# Secret Safety Decision

Real provider credentials must not be exposed in frontend code.

Do not put real provider secrets in:

- committed files;
- `VITE_` environment variables;
- browser JavaScript;
- fixture files;
- README examples.

Real API mode must use:

```text
browser -> backend/serverless proxy -> Amadeus API
```

The backend/serverless proxy is responsible for protecting provider credentials.

---

# Mock Fallback Decision

Mock mode remains required.

Mock mode is used for:

- local development;
- automated tests;
- demos without credentials;
- safe fallback when real API configuration is missing.

MVP v3 must not remove current mock search behavior.

---

# Status

```text
API_PROVIDER_DECISION_READY
```
