# 03-12 Wave 12 Exit Checklist - Flight Search MVP v3

## Wave

```text
Wave 12 - New Provider Adapter Skeleton
```

---

# Exit Checklist

- [x] `duffel` API mode is supported
- [x] Duffel mode requires a frontend-safe proxy URL
- [x] Unsupported modes still fall back to mock mode
- [x] Duffel proxy client maps route text to IATA codes
- [x] Duffel proxy payload does not include provider secrets
- [x] Duffel adapter routes through the provider-agnostic flight service
- [x] Duffel normalizer maps mocked offer requests into the app flight shape
- [x] Amadeus legacy adapter path remains tested
- [x] Mock mode remains unchanged

---

# Out Of Scope

- Duffel backend/serverless proxy implementation
- Live Duffel credentials
- Booking flow
- Seat selection
- Payment flow

---

# Result

```text
WAVE_12 = CODE_COMPLETE_UNCOMMITTED
DUFFEL_MODE_READY
DUFFEL_ADAPTER_SKELETON_READY
DUFFEL_NORMALIZER_SKELETON_READY
```
