# 03-13 Wave 13 Exit Checklist - Flight Search MVP v3

## Wave

```text
Wave 13 - Duffel Backend Serverless Proxy
```

---

# Exit Checklist

- [x] Duffel backend/serverless proxy module exists
- [x] Proxy rejects unsupported HTTP methods
- [x] Proxy requires server-side Duffel credentials
- [x] Proxy validates frontend payload before Duffel calls
- [x] Proxy calls Duffel Offer Requests endpoint
- [x] Proxy sends `Authorization: Bearer <token>`
- [x] Proxy sends `Duffel-Version: v2`
- [x] Proxy sends resolved origin IATA code
- [x] Proxy sends resolved destination IATA code
- [x] Proxy preserves mandatory stopover as two Duffel slices
- [x] Proxy maps authorization failures safely
- [x] Proxy maps rate limits safely
- [x] Proxy returns provider JSON for frontend normalization
- [x] Existing mock mode remains unchanged
- [x] Amadeus legacy path remains unchanged

---

# Out Of Scope

- Live Duffel credential smoke test
- Production deployment
- Token/key rotation
- Per-user rate limiting
- Booking flow
- Seat selection
- Payment flow

---

# Result

```text
WAVE_13 = CODE_COMPLETE_UNCOMMITTED
DUFFEL_BACKEND_PROXY_READY
SERVER_SIDE_DUFFEL_CREDENTIALS_READY
MANDATORY_STOPOVER_DUFFEL_SLICES_READY
```
