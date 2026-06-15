# Round-trip Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add one-way / round-trip search with hidden return date fields in one-way mode and paired outbound + return result rows in round-trip mode.

**Architecture:** Keep provider adapters one-way. Extend the form/query model with `tripType` and `returnDateRange`, validate return dates only for round trips, and orchestrate two one-way searches in `flightService` for round trips. Render round-trip results with a dedicated paired-results component that combines sorted outbound and return flights by index.

**Tech Stack:** Vite, vanilla JavaScript modules, Tailwind CSS classes, Node.js built-in test runner.

---

## File Structure

- Modify `src/components/searchForm.js`: add trip type defaults/control, conditional return date fields, and form-data parsing.
- Modify `src/utils/validation.js`: add round-trip return date validation.
- Modify `src/services/flightService.js`: keep one-way behavior and add round-trip orchestration above adapters.
- Modify `src/main.js`: support result objects with outbound and return arrays by rendering paired round-trip rows.
- Modify `src/components/resultsList.js`: accept an optional title and date-range summary label.
- Create `src/components/roundTripResultsList.js`: pair sorted outbound and return flights by index and render one row per round-trip option.
- Modify tests in `test/searchForm.test.js`, `test/validation.test.js`, `test/flightService.test.js`, and `test/resultsList.test.js`.
- Create `test/roundTripResultsList.test.js`.

---

### Task 1: Form query model and conditional return fields

**Files:**
- Modify: `src/components/searchForm.js`
- Test: `test/searchForm.test.js`

- [ ] **Step 1: Write failing tests**

Add tests that assert defaults include `tripType` and `returnDateRange`, one-way markup has the trip selector but no return date inputs, round-trip markup includes return date inputs, and submitted form data creates the round-trip query.

```js
test('search form defaults to one-way trip fields', () => {
  assert.deepEqual(Object.keys(searchForm.searchFormDefaults ?? {}), [
    'tripType',
    'from',
    'via',
    'to',
    'departureDate',
    'dateRange',
    'returnDateRange',
    'adults',
    'minLayover',
    'maxLayover',
  ]);
  assert.equal(searchForm.searchFormDefaults.tripType, 'oneWay');
  assert.deepEqual(searchForm.searchFormDefaults.returnDateRange, {
    start: '',
    end: '',
  });
});

test('search form hides return date fields for one-way trips', () => {
  const markup = searchForm.createSearchForm();

  assert.match(markup, /One-way/);
  assert.match(markup, /Round-trip/);
  assert.doesNotMatch(markup, /name="returnDateRangeStart"/);
  assert.doesNotMatch(markup, /name="returnDateRangeEnd"/);
});

test('search form shows return date fields for round trips', () => {
  const markup = searchForm.createSearchForm({
    values: {
      ...searchForm.searchFormDefaults,
      tripType: 'roundTrip',
      returnDateRange: {
        start: '2026-08-20',
        end: '2026-08-25',
      },
    },
  });

  assert.match(markup, /Return Date Start/);
  assert.match(markup, /Return Date End/);
  assert.match(markup, /name="returnDateRangeStart"/);
  assert.match(markup, /name="returnDateRangeEnd"/);
  assert.match(markup, /value="2026-08-20"/);
  assert.match(markup, /value="2026-08-25"/);
});

test('creates a round-trip search query shape from submitted form data', () => {
  const formData = new FormData();

  formData.set('tripType', 'roundTrip');
  formData.set('from', 'Boston');
  formData.set('via', 'Istanbul');
  formData.set('to', 'Saint Petersburg');
  formData.set('dateRangeStart', '2026-08-01');
  formData.set('dateRangeEnd', '2026-08-10');
  formData.set('returnDateRangeStart', '2026-08-20');
  formData.set('returnDateRangeEnd', '2026-08-25');
  formData.set('adults', '2');
  formData.set('minLayover', '3');
  formData.set('maxLayover', '12');

  assert.deepEqual(searchForm.createSearchQueryFromFormData(formData), {
    ...searchForm.searchFormDefaults,
    tripType: 'roundTrip',
    returnDateRange: {
      start: '2026-08-20',
      end: '2026-08-25',
    },
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `node --test test/searchForm.test.js`

Expected: FAIL because `tripType`, `returnDateRange`, and return date fields do not exist.

- [ ] **Step 3: Implement minimal form changes**

Update defaults, add a radio/segmented trip type control, conditionally render return date fields when `values.tripType === 'roundTrip'`, and parse `returnDateRangeStart` / `returnDateRangeEnd` in `createSearchQueryFromFormData`.

- [ ] **Step 4: Run form tests**

Run: `node --test test/searchForm.test.js`

Expected: PASS.

---

### Task 2: Round-trip validation

**Files:**
- Modify: `src/utils/validation.js`
- Test: `test/validation.test.js`

- [ ] **Step 1: Write failing tests**

Add tests for required return dates, invalid return range ordering, and return start before departure end.

```js
test('requires return dates for round-trip searches', () => {
  const result = validateSearchQuery({
    ...validQuery,
    tripType: 'roundTrip',
    returnDateRange: {
      start: '',
      end: '',
    },
  });

  assert.equal(result.isValid, false);
  assert.equal(result.errors.returnDateRange, 'Return Date Range is required for round trips.');
});

test('rejects invalid round-trip return date ranges', () => {
  const result = validateSearchQuery({
    ...validQuery,
    tripType: 'roundTrip',
    returnDateRange: {
      start: '2026-08-25',
      end: '2026-08-20',
    },
  });

  assert.equal(result.isValid, false);
  assert.equal(result.errors.returnDateRange, 'Return Date Range start date must be before or equal to end date.');
});

test('rejects return dates before the outbound date range ends', () => {
  const result = validateSearchQuery({
    ...validQuery,
    tripType: 'roundTrip',
    returnDateRange: {
      start: '2026-08-09',
      end: '2026-08-20',
    },
  });

  assert.equal(result.isValid, false);
  assert.equal(result.errors.returnDateRange, 'Return Date Start cannot be earlier than Departure Date End.');
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `node --test test/validation.test.js`

Expected: FAIL because return date validation is not implemented.

- [ ] **Step 3: Implement validation**

Add `isRoundTrip(query)` and validate `returnDateRange` only when round-trip. Keep existing one-way queries valid.

- [ ] **Step 4: Run validation tests**

Run: `node --test test/validation.test.js`

Expected: PASS.

---

### Task 3: Round-trip service orchestration

**Files:**
- Modify: `src/services/flightService.js`
- Test: `test/flightService.test.js`

- [ ] **Step 1: Write failing tests**

Add tests that one-way still returns an array and round-trip returns two named arrays. For proxy mode, assert two calls and reversed return payload.

```js
test('searchFlightOffers returns outbound and return sections for round trips', async () => {
  const results = await searchFlightOffers(
    {
      ...baseQuery,
      tripType: 'roundTrip',
      returnDateRange: {
        start: '2026-08-01',
        end: '2026-08-10',
      },
    },
    {
      delayMs: 0,
      env: {
        VITE_FLIGHT_API_MODE: 'mock',
      },
    },
  );

  assert.deepEqual(Object.keys(results), ['outbound', 'return']);
  assert.ok(Array.isArray(results.outbound));
  assert.ok(Array.isArray(results.return));
  assert.ok(results.outbound.every((flight) => flight.route.origin.city === 'Boston'));
  assert.ok(results.return.every((flight) => flight.route.origin.city === 'Saint Petersburg'));
  assert.ok(results.return.every((flight) => flight.route.destination.city === 'Boston'));
});

test('searchFlightOffers sends reversed route and return dates for round-trip proxy searches', async () => {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });

    return {
      ok: true,
      json: async () => serpapiGoogleFlightsFixture,
    };
  };

  await searchFlightOffers(
    {
      ...baseQuery,
      tripType: 'roundTrip',
      returnDateRange: {
        start: '2026-08-20',
        end: '2026-08-25',
      },
    },
    {
      fetchImpl,
      env: {
        VITE_FLIGHT_API_MODE: 'serpapi',
        VITE_FLIGHT_API_PROXY_URL: 'https://example.com/api/serpapi-flights',
      },
    },
  );

  assert.equal(calls.length, 2);

  const outboundPayload = JSON.parse(calls[0].init.body);
  const returnPayload = JSON.parse(calls[1].init.body);

  assert.equal(outboundPayload.route.from.iata, 'BOS');
  assert.equal(outboundPayload.route.to.iata, 'LED');
  assert.equal(outboundPayload.dateRange.start, '2026-08-01');
  assert.equal(outboundPayload.dateRange.end, '2026-08-10');
  assert.equal(returnPayload.route.from.iata, 'LED');
  assert.equal(returnPayload.route.to.iata, 'BOS');
  assert.equal(returnPayload.route.via.iata, 'IST');
  assert.equal(returnPayload.dateRange.start, '2026-08-20');
  assert.equal(returnPayload.dateRange.end, '2026-08-25');
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `node --test test/flightService.test.js`

Expected: FAIL because round-trip orchestration does not exist.

- [ ] **Step 3: Implement orchestration**

Extract a private `searchOneWayFlightOffers(query, options)` from current `searchFlightOffers`. Make `searchFlightOffers` return the one-way array for non-round-trip queries and `{ outbound, return }` for `tripType === 'roundTrip'`. Build the return query by swapping `from` and `to`, preserving `via`, and replacing `dateRange` / `departureDate` with `returnDateRange.start`.

- [ ] **Step 4: Run service tests**

Run: `node --test test/flightService.test.js`

Expected: PASS.

---

### Task 4: Render round-trip results as paired rows

**Files:**
- Create: `src/components/roundTripResultsList.js`
- Modify: `src/components/resultsList.js`
- Modify: `src/main.js`
- Create: `test/roundTripResultsList.test.js`
- Test: `test/resultsList.test.js`

- [ ] **Step 1: Write failing tests**

Add tests for pairing outbound and return flights by sorted index, combined price, and empty paired results.

```js
test('round-trip results render paired outbound and return cards', () => {
  const markup = createRoundTripResultsList({
    outbound: [expensiveOutbound, cheapOutbound],
    return: [expensiveReturn, cheapReturn],
  });

  assert.match(markup, /Round-trip options/);
  assert.match(markup, /Option 1/);
  assert.match(markup, /Outbound flight/);
  assert.match(markup, /Return flight/);
  assert.match(markup, /Total estimated price/);
  assert.match(markup, /\$500/);
});

test('round-trip results pair flights by index after sorting each side', () => {
  const markup = createRoundTripResultsList({
    outbound: [expensiveOutbound, cheapOutbound],
    return: [expensiveReturn, cheapReturn],
  });

  assert.match(markup, /Cheap outbound[\s\S]*Cheap return/);
});

test('round-trip results render an empty state when either side has no pair', () => {
  const markup = createRoundTripResultsList({
    outbound: [cheapOutbound],
    return: [],
  });

  assert.match(markup, /No matching round-trip pairs found/);
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `node --test test/roundTripResultsList.test.js`

Expected: FAIL because `src/components/roundTripResultsList.js` does not exist.

- [ ] **Step 3: Implement rendering support**

Create `createRoundTripResultsList({ outbound, return }, { sortBy })`. Sort each side with `sortFlights`, pair by index up to the shorter list, sort pairs by total price or total duration, render the same sort dropdown used by one-way results, and render a wrapper card with two child flight cards per row. In `src/main.js`, detect result objects with `outbound` and `return` and render `createRoundTripResultsList` instead of separate lists.

- [ ] **Step 4: Run rendering tests**

Run: `node --test test/roundTripResultsList.test.js test/resultsList.test.js`

Expected: PASS.

---

### Task 5: Full verification

**Files:**
- Verify all modified files.

- [ ] **Step 1: Run full unit suite**

Run: `npm test`

Expected: all tests pass.

- [ ] **Step 2: Run production build**

Run: `npm run build`

Expected: Vite build succeeds.

- [ ] **Step 3: Review git diff**

Run: `git diff -- src test docs`

Expected: diff matches the approved round-trip design, with no unrelated changes.
