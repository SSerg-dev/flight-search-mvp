# 03-08 Wave 8 Exit Checklist - Flight Search MVP v3

## Wave

```text
Wave 8 - Search Form Airport Mapping
```

---

# Exit Checklist

- [x] Amadeus proxy request maps `from` text to IATA code
- [x] Amadeus proxy request maps `via` text to IATA code
- [x] Amadeus proxy request maps `to` text to IATA code
- [x] Proxy payload preserves original user query labels
- [x] Proxy payload includes resolved airport IATA codes
- [x] Missing `from` airport fails safely
- [x] Missing `via` airport fails safely
- [x] Missing `to` airport fails safely
- [x] Airport mapping failure happens before proxy fetch
- [x] Mock mode behavior remains unchanged
- [x] Service-level Amadeus payload mapping is tested
- [x] Existing Amadeus response normalization still passes

---

# Out Of Scope

- Search form autocomplete
- Airport picker UI
- Full OurAirports CSV import
- Live Amadeus credentials
- Backend/serverless proxy implementation

---

# Result

```text
WAVE_8 = COMPLETED
SEARCH_FORM_AIRPORT_MAPPING_READY
AMADEUS_PROXY_IATA_PAYLOAD_READY
MOCK_MODE_UNCHANGED
```
