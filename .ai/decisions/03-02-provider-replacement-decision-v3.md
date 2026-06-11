# 03-02 Provider Replacement Decision - Flight Search MVP v3

## Context

The Amadeus for Developers Self-Service portal is scheduled for decommissioning on 2026-07-17. That makes Amadeus Self-Service a high-risk primary provider path for this MVP.

Wave 10 remains useful as a reference backend/serverless proxy implementation, but Amadeus should no longer be the main real API integration target.

---

# Decision

```text
PRIMARY_FLIGHT_PROVIDER = DUFFEL
LEGACY_REFERENCE_PROVIDER = AMADEUS
NEXT_IMPLEMENTATION_TARGET = DUFFEL_ADAPTER_AND_PROXY
```

---

# Rationale

- Duffel has current official API reference documentation for flight offer requests.
- Duffel uses an offer request model that fits the existing search flow.
- Duffel can stay behind the existing backend/serverless proxy boundary.
- Duffel supports test/live mode concepts that fit MVP verification.
- Amadeus Self-Service should remain as a legacy/reference implementation only.

---

# Provider Notes

## Duffel

Selected as the primary replacement provider.

Relevant official docs:

- API reference overview: `https://duffel.com/docs/api/overview/welcome`
- Create offer request: `https://duffel.com/docs/api/offer-requests/create-offer-request`

## Amadeus

Moved to legacy/reference status because of Self-Service decommissioning risk.

## Travelpayouts / Aviasales

Not selected for the primary adapter because it is more affiliate/data oriented and less clearly aligned with the current offer-search normalization path.

## Kiwi / Tequila

Not selected for the primary adapter because public documentation access and current API onboarding are less clear from the available docs.

---

# Result

```text
PROVIDER_REPLACEMENT_DECISION = COMPLETED
PRIMARY_PROVIDER = DUFFEL
READY_FOR_DUFFEL_ADAPTER_SKELETON
```
