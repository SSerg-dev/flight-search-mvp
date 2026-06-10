# 03-06 Wave 6 Exit Checklist — Flight Search MVP v3

## Wave

```text
Wave 6 — UI Readiness Pass
```

---

# Exit Checklist

- [x] Realistic normalized UI fixture added
- [x] Missing optional normalized UI fixture added
- [x] Result card handles long airline names
- [x] Result card handles different currencies
- [x] Result card handles missing flight numbers
- [x] Result card handles missing price display
- [x] Result card avoids `undefined` and `null` text
- [x] Results list copy is provider-neutral
- [x] Existing mock search UX tests still pass
- [x] Loading state tests still pass
- [x] Error state tests still pass
- [x] Sorting tests still pass
- [x] Empty state tests still pass
- [ ] Desktop layout smoke check
- [ ] Mobile layout smoke check
- [ ] Browser console error check

---

# Browser Verification Status

Browser smoke verification is pending because the in-app browser runner failed to start in the local Windows sandbox.

Local server verification:

```text
http://127.0.0.1:5173 -> HTTP 200
```

---

# Result

```text
UI_AUTOMATED_READINESS_READY
BROWSER_SMOKE_CHECK_PENDING
WAVE_6_PARTIAL_READY_FOR_REVIEW
```
