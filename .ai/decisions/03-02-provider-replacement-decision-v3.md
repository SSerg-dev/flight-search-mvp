# 03-02 Provider Replacement Decision - Flight Search MVP v3

## Context

The Amadeus for Developers Self-Service portal is scheduled for decommissioning on 2026-07-17. That makes Amadeus Self-Service a high-risk primary provider path for this MVP.

Wave 10 remains useful as a reference backend/serverless proxy implementation, but Amadeus should no longer be the main real API integration target.

The project later added both Duffel and SerpApi adapter/proxy paths. After live experimentation, SerpApi became the current working MVP provider path because it returned usable Google Flights-style search results for the target route. SerpApi has a known rate-limit risk, so mock mode must remain the default local/test path. Duffel and Amadeus runtime paths were later removed from active code to keep the MVP focused on `mock` and `serpapi`.

---

# Decision

```text
PRIMARY_FLIGHT_PROVIDER = SERPAPI
LEGACY_REFERENCE_PROVIDER = AMADEUS
HISTORICAL_REFERENCE_PROVIDER = DUFFEL
CURRENT_IMPLEMENTATION_TARGET = SERPAPI_GOOGLE_FLIGHTS_PROXY
```

---

# Rationale

- SerpApi Google Flights returned usable live search results for the MVP route and card shape.
- SerpApi can stay behind the existing backend/serverless proxy boundary.
- SerpApi works with the current normalized flight offer pipeline.
- SerpApi has a clear operational caveat: rate limits can interrupt live testing.
- Duffel remains useful as historical provider research context, but it is not an active runtime provider.
- Amadeus Self-Service remains historical provider research only.

---

# Provider Notes

## SerpApi

Selected as the current primary MVP provider path.

Relevant local files:

- `api/serpapi-flights.js`
- `src/services/adapters/serpapiFlightAdapter.js`
- `src/services/proxy/serpapiProxyClient.js`
- `src/services/normalizers/serpapiFlightNormalizer.js`
- `test/serpapiServerlessProxy.test.js`
- `test/serpapiFlightNormalizer.test.js`

## Duffel

Retained as historical provider research context.

Relevant official docs:

- API reference overview: `https://duffel.com/docs/api/overview/welcome`
- Create offer request: `https://duffel.com/docs/api/offer-requests/create-offer-request`

## Amadeus

Retained as historical provider research only because of Self-Service decommissioning risk.

## Travelpayouts / Aviasales

Not selected for the primary adapter because it is more affiliate/data oriented and less clearly aligned with the current offer-search normalization path.

## Kiwi / Tequila

Not selected for the primary adapter because public documentation access and current API onboarding are less clear from the available docs.

---

# Result

```text
PROVIDER_REPLACEMENT_DECISION = COMPLETED
PRIMARY_PROVIDER = SERPAPI
HISTORICAL_REFERENCE_PROVIDER = DUFFEL
LEGACY_REFERENCE_PROVIDER = AMADEUS
READY_FOR_SERPAPI_MVP_VERIFICATION
```
