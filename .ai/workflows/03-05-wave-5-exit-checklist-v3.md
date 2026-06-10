# 03-05 Wave 5 Exit Checklist — Flight Search MVP v3

## Wave

```text
Wave 5 — Real API Request Flow
```

---

# Exit Checklist

- [x] Proxy request contract defined
- [x] Proxy request payload contains only user search data
- [x] Proxy request payload contains no provider secrets
- [x] Proxy client skeleton created
- [x] Proxy client requires configured proxy URL
- [x] Proxy client uses mocked fetch in tests
- [x] Configured Amadeus mode routes through proxy client
- [x] Amadeus proxy responses route through normalizer
- [x] Normalized Amadeus offers return through `searchFlightOffers`
- [x] Missing proxy URL maps to safe service error
- [x] Authorization failures map to safe service error
- [x] Rate limits map to safe service error
- [x] Network failures map to safe service error
- [x] Malformed provider responses map to safe service error
- [x] No live API calls required for tests

---

# Result

```text
REAL_API_FLOW_READY
PROXY_REQUEST_CONTRACT_READY
PROXY_CLIENT_SKELETON_READY
MOCKED_AMADEUS_FLOW_READY
WAVE_5_READY_FOR_REVIEW
```
