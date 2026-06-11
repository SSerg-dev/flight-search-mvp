# 03-10 Wave 10 Exit Checklist - Flight Search MVP v3

## Wave

```text
Wave 10 - Backend Serverless Proxy
```

---

# Exit Checklist

- [x] Backend/serverless proxy module exists
- [x] Proxy rejects unsupported HTTP methods
- [x] Proxy requires server-side Amadeus credentials
- [x] Proxy validates frontend payload before Amadeus calls
- [x] Proxy requests Amadeus OAuth token server-side
- [x] Proxy calls Amadeus Flight Offers Search
- [x] Proxy sends resolved origin IATA code
- [x] Proxy sends resolved destination IATA code
- [x] Proxy sends mandatory `via` IATA code as an included connection point
- [x] Proxy maps authorization failures safely
- [x] Proxy maps rate limits safely
- [x] Proxy returns provider JSON for frontend normalization
- [x] Server-only env vars are documented
- [x] Existing mock mode remains unchanged

---

# Out Of Scope

- Live Amadeus credential smoke test
- Production deployment
- Token caching
- Per-user rate limiting
- Observability and request logging
- Booking flow

---

# Result

```text
WAVE_10 = COMPLETED
BACKEND_PROXY_READY
SERVER_SIDE_AMADEUS_CREDENTIALS_READY
MANDATORY_STOPOVER_PROXY_PAYLOAD_READY
```
