# 03-14 Wave 14 Exit Checklist - Flight Search MVP v3

## Wave

```text
Wave 14 - Duffel Local Deployment Wiring
```

---

# Exit Checklist

- [x] Local Vite dev middleware exists
- [x] Middleware handles `/api/duffel-flights`
- [x] Middleware forwards request method to the serverless handler
- [x] Middleware forwards request body to the serverless handler
- [x] Middleware writes handler status to the response
- [x] Middleware writes handler JSON headers to the response
- [x] Middleware ignores unrelated Vite routes
- [x] Vite config registers the Duffel API middleware
- [x] Existing Duffel serverless handler is reused locally
- [x] Existing mock mode remains unchanged

---

# Out Of Scope

- Live Duffel credential smoke test
- Production deployment provider selection
- Secret manager configuration
- CI deployment pipeline
- Booking flow

---

# Result

```text
WAVE_14 = CODE_COMPLETE_UNCOMMITTED
LOCAL_DUFFEL_PROXY_ROUTE_READY
VITE_DEV_API_WIRING_READY
SERVERLESS_HANDLER_REUSED_LOCALLY
```
