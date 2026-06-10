# 03-02 Producer Agent Package v3 — Flight Search MVP v3

## Purpose

This file defines the Producer Agent for MVP v3 of the Flight Search application.

The Producer Agent turns Analyst Output v3 and Workflow v3 into a small, executable, reviewable implementation plan.

---

# 1. Role

You are the Producer Agent for Flight Search MVP v3.

Your main function is to create a small, wave-based implementation plan for real flight API integration through a safe provider-agnostic adapter boundary.

You do not write code.

You do not review the plan as Controller.

You create the plan that will be reviewed by Controller Agent.

---

# 2. Context

The project already has MVP v2 code complete.

Current workflow:

```text
Analyst → Producer → Controller
```

MVP v3 goal:

```text
Integrate real flight data safely while preserving mock fallback and provider-agnostic UI.
```

Approved stack:

- Vite
- Vanilla JavaScript
- Tailwind CSS
- Node test runner

Analyst v3 recommendation:

```text
Preferred first provider: Amadeus Self-Service APIs
Required architecture: mock fallback plus backend/serverless proxy for real credentials
Do not expose API secrets in frontend code
Do not remove current mock service behavior
```

MVP v3 must not include:

- committed API keys
- API secrets in frontend `VITE_` variables
- raw provider responses rendered directly in UI
- booking
- payment
- ticketing
- user accounts
- saved searches
- favorites
- provider switching UI

---

# 3. Producer Receives

Producer receives:

## Analyst Output v3

Expected Analyst recommendations:

1. API Provider Decision
2. Integration Boundary
3. Environment and Secret Strategy
4. Adapter Interface
5. Response Normalization
6. Mock Fallback
7. API Error Handling
8. End-to-End Verification

## Workflow v3

Workflow file:

```text
03-00-workflow-flight-search-mvp-v3.md
```

Workflow waves:

1. API Provider Decision + Integration Boundary
2. Environment and Configuration
3. API Adapter Skeleton
4. Response Normalization
5. Real API Request Flow
6. UI Readiness Pass
7. RED Test v3

## Current MVP v2 Application State

Relevant current modules:

```text
src/services/flightService.js
src/data/mockFlights.js
src/utils/searchFlights.js
src/utils/sortFlights.js
src/utils/validation.js
src/components/searchForm.js
src/components/searchStatus.js
src/components/resultsList.js
src/components/resultCard.js
src/main.js
```

Current verification:

```text
npm test
npm run build
```

---

# 4. Producer Instructions

Create a detailed implementation plan for MVP v3.

The plan must contain:

- Wave 1 plan
- Wave 2 plan
- Wave 3 plan
- Wave 4 plan
- Wave 5 plan
- Wave 6 plan
- Wave 7 plan

Each wave must be small enough to implement and review independently.

Each task must include:

- Goal
- Input
- Action
- Expected Result
- Check
- Size

Allowed task sizes:

```text
Small
Medium
Too Big
```

Do not create tasks marked as `Too Big`.

If a task is too large, split it into smaller tasks.

Producer must protect MVP v2 behavior while planning MVP v3.

Producer must prefer tests with fixtures and mocked provider responses before any live API dependency is required.

Producer must include a secret-safety check in the final RED Test v3 plan.

---

# 5. Producer Creates

Producer creates:

## Wave 1 — API Provider Decision + Integration Boundary

Goal:

```text
Confirm Amadeus-first provider direction and define the safe integration boundary.
```

## Wave 2 — Environment and Configuration

Goal:

```text
Prepare API mode configuration without exposing secrets.
```

## Wave 3 — API Adapter Skeleton

Goal:

```text
Create mock and real adapter boundaries while preserving the existing service contract.
```

## Wave 4 — Response Normalization

Goal:

```text
Normalize provider fixture responses into the existing MVP v2 flight shape.
```

## Wave 5 — Real API Request Flow

Goal:

```text
Plan real search request mapping through a backend/serverless proxy and mocked provider responses.
```

## Wave 6 — UI Readiness Pass

Goal:

```text
Verify real-data variations do not break the existing UI.
```

## Wave 7 — RED Test v3

Goal:

```text
Perform final acceptance review for MVP v3 readiness.
```

---

# 6. Output Format

The Producer must respond in this format:

```md
# Producer Output v3

## Project

Flight Search MVP v3

## Goal

Integrate real flight data through a safe provider-agnostic adapter boundary.

## Source Inputs

- Analyst Output v3
- 03-00-workflow-flight-search-mvp-v3.md
- current MVP v2 application state

## Provider Direction

[State preferred provider and why]

## Architecture Direction

[State adapter boundary, mock fallback, and backend/serverless proxy direction]

## Implementation Plan

---

## Wave 1 — API Provider Decision + Integration Boundary

### Task 1: [task name]

**Goal:**  
[goal]

**Input:**  
[input]

**Action:**  
[action]

**Expected Result:**  
[expected result]

**Check:**  
[how to verify]

**Size:**  
Small / Medium

---

## Wave 2 — Environment and Configuration

### Task 1: [task name]

**Goal:**  
...

**Input:**  
...

**Action:**  
...

**Expected Result:**  
...

**Check:**  
...

**Size:**  
Small / Medium

---

## Wave 3 — API Adapter Skeleton

[Tasks]

---

## Wave 4 — Response Normalization

[Tasks]

---

## Wave 5 — Real API Request Flow

[Tasks]

---

## Wave 6 — UI Readiness Pass

[Tasks]

---

## Wave 7 — RED Test v3

[Checklist]

---

## Not Included In MVP v3

- committed API keys
- exposed frontend secrets
- direct browser calls requiring API secrets
- booking
- payment
- ticketing
- user accounts
- saved searches
- favorites
- provider switching UI

## Self-Check

- [ ] Tasks are small enough
- [ ] Each task has a check
- [ ] Amadeus-first direction is explicit
- [ ] Backend/serverless proxy boundary is explicit
- [ ] Mock fallback is preserved
- [ ] Existing UI service contract is preserved
- [ ] Provider responses are normalized before UI
- [ ] No secrets are exposed in frontend code
- [ ] No feature creep is introduced
- [ ] Plan is ready for Controller review

## Send To Controller

Status: READY_FOR_REVIEW  
Version: v1
```

---

# 7. Handoff To Controller

Controller Agent receives:

- Producer Output v3;
- Analyst Output v3;
- MVP v3 workflow document.

Next expected output:

```text
Controller Output v3
```

---

# 8. Final Producer Status

```text
Producer Agent Package v3 created.
Status: READY_TO_RUN_PRODUCER_V3
Next Agent: Producer
```

---

# 9. Producer Output v3

## Project

Flight Search MVP v3

## Goal

Integrate real flight data through a safe provider-agnostic adapter boundary.

MVP v3 should preserve the existing MVP v2 UI contract while preparing the service layer for a real provider.

---

## Source Inputs

- Analyst Output v3
- `.ai/workflows/03-00-workflow-flight-search-mvp-v3.md`
- current MVP v2 application state

---

## Provider Direction

Preferred first provider:

```text
Amadeus Self-Service APIs
```

Reason:

Amadeus is the best first fit for MVP v3 because it supports flight offer search, has test-oriented developer documentation, and maps reasonably well to the current MVP v2 normalized flight result shape.

Duffel remains a secondary option for a later booking-grade product path.

Schedule/status-oriented APIs are deferred because they do not solve fare offer search.

---

## Architecture Direction

MVP v3 should use this architecture:

```text
UI
↓
src/services/flightService.js
↓
adapter selection
↓
mock adapter OR real provider adapter
↓
normalization layer
↓
normalized flight offers
```

Runtime direction:

```text
Local/test mode:
browser → mock adapter

Real API mode:
browser → backend/serverless proxy → Amadeus API
```

Important boundary:

```text
No API secrets in frontend code.
No raw provider responses in UI components.
No removal of mock mode.
```

---

## Implementation Plan

---

## Wave 1 — API Provider Decision + Integration Boundary

Goal:

Confirm Amadeus-first provider direction and define the safe integration boundary.

### Task 1: Document Provider Decision

**Goal:**  
Record the Amadeus-first provider choice and fallback candidates.

**Input:**  
Analyst Output v3 and official provider docs.

**Action:**  
Create or update a decision note that records:

- preferred provider: Amadeus Self-Service APIs;
- secondary provider: Duffel;
- deferred category: schedule/status APIs;
- reason for choosing Amadeus first;
- reason real credentials require a backend/serverless proxy.

**Expected Result:**  
The project has a durable provider decision that Producer and Controller can review.

**Check:**  
Decision document includes `Amadeus`, `Duffel`, `backend/serverless proxy`, and `no frontend secrets`.

**Size:**  
Small

---

### Task 2: Define Integration Boundary

**Goal:**  
Define where provider-specific logic belongs.

**Input:**  
Current `src/services/flightService.js` and Analyst Output v3 adapter recommendation.

**Action:**  
Document the target service boundary:

```text
flightService → adapter selection → provider adapter → normalizer
```

Also document that UI components must continue to consume normalized offers only.

**Expected Result:**  
Implementation can proceed without debating where provider code belongs.

**Check:**  
Boundary document states that UI does not import Amadeus modules or render raw Amadeus responses.

**Size:**  
Small

---

### Task 3: Define Normalized Flight Offer Contract

**Goal:**  
Make the internal result shape explicit before provider mapping begins.

**Input:**  
`src/data/mockFlights.js`, `src/components/resultCard.js`, `src/utils/sortFlights.js`.

**Action:**  
Document the normalized flight offer contract:

```text
id
airline
price
route
segments
duration
availability
```

Include required fields and safe defaults for optional provider data.

**Expected Result:**  
Provider normalization has a clear target shape.

**Check:**  
Contract matches the fields currently consumed by result cards, sorting, and search filtering.

**Size:**  
Small

---

### Task 4: Define Wave 1 Exit Checklist

**Goal:**  
Create a simple checkpoint before implementation waves begin.

**Input:**  
Workflow v3 Wave 1 exit criteria.

**Action:**  
Define this checklist:

- provider decision documented;
- integration boundary documented;
- normalized result contract documented;
- mock fallback required;
- backend/serverless proxy required for real credentials;
- no frontend secrets allowed.

**Expected Result:**  
Wave 1 can be reviewed cleanly before Wave 2 starts.

**Check:**  
Checklist can be answered yes/no by Controller.

**Size:**  
Small

---

## Wave 2 — Environment and Configuration

Goal:

Prepare API mode configuration without exposing secrets.

### Task 1: Add Environment Example

**Goal:**  
Document expected configuration values without real secrets.

**Input:**  
Project root and MVP v3 constraints.

**Action:**  
Create `.env.example` with safe placeholder values, such as:

```text
VITE_FLIGHT_API_MODE=mock
VITE_FLIGHT_API_PROXY_URL=
```

Do not include Amadeus API secret placeholders in frontend env unless they are clearly marked as server-only and not used by Vite.

**Expected Result:**  
Developers understand local mock mode and future proxy URL configuration.

**Check:**  
`.env.example` contains no real credentials and defaults to mock mode.

**Size:**  
Small

---

### Task 2: Add API Config Module

**Goal:**  
Centralize safe frontend configuration.

**Input:**  
`src/config/apiConfig.js` target path.

**Action:**  
Create a config module that reads safe frontend values:

```text
apiMode
proxyUrl
```

Reject unsupported modes with safe fallback to mock.

**Expected Result:**  
Service code has one place to read API mode.

**Check:**  
Tests confirm missing config resolves to mock mode.

**Size:**  
Medium

---

### Task 3: Add Config Tests

**Goal:**  
Prevent unsafe or unsupported configuration behavior.

**Input:**  
`test` directory and config module.

**Action:**  
Add tests for:

- missing mode;
- `mock` mode;
- unsupported mode;
- real mode without proxy URL.

**Expected Result:**  
Configuration behavior is deterministic.

**Check:**  
`npm test` passes.

**Size:**  
Medium

---

### Task 4: Update README Setup Notes

**Goal:**  
Explain local mock mode and real API boundary.

**Input:**  
`README.md` and `.env.example`.

**Action:**  
Update README with:

- default mock mode;
- no real API keys in frontend;
- future proxy requirement for real API mode;
- test/build commands.

**Expected Result:**  
Project setup is clear for MVP v3.

**Check:**  
README includes `VITE_FLIGHT_API_MODE=mock` and warning about secrets.

**Size:**  
Small

---

## Wave 3 — API Adapter Skeleton

Goal:

Create mock and real adapter boundaries while preserving the existing service contract.

### Task 1: Create Mock Flight Adapter

**Goal:**  
Move current mock-backed search behavior behind an adapter.

**Input:**  
`src/services/flightService.js`, `src/data/mockFlights.js`, `src/utils/searchFlights.js`.

**Action:**  
Create:

```text
src/services/adapters/mockFlightAdapter.js
```

Move mock search behavior into the adapter while preserving async behavior and simulated failures.

**Expected Result:**  
Mock search remains available through an explicit adapter.

**Check:**  
Existing flight service tests still pass.

**Size:**  
Medium

---

### Task 2: Create Amadeus Adapter Skeleton

**Goal:**  
Create the real provider module boundary without making live API calls yet.

**Input:**  
Analyst Output v3 and target service structure.

**Action:**  
Create:

```text
src/services/adapters/amadeusFlightAdapter.js
```

Export a function compatible with the mock adapter. For now, it should call a proxy client abstraction or throw a controlled "not configured" service error when real mode is unavailable.

**Expected Result:**  
The codebase has a stable file boundary for Amadeus work.

**Check:**  
Tests confirm the adapter does not expose credentials and fails safely when unconfigured.

**Size:**  
Medium

---

### Task 3: Add Adapter Selection

**Goal:**  
Route service calls through the configured adapter.

**Input:**  
`src/services/flightService.js`, config module, mock adapter, Amadeus adapter.

**Action:**  
Update `searchFlightOffers` to select adapter based on safe config:

```text
mock → mockFlightAdapter
real/amadeus → amadeusFlightAdapter
```

Unsupported or unsafe config should fall back to mock or return a controlled error based on config rules.

**Expected Result:**  
UI continues calling the same service function.

**Check:**  
Tests confirm mock mode returns existing mock results through the adapter path.

**Size:**  
Medium

---

### Task 4: Add Adapter Selection Tests

**Goal:**  
Verify adapter routing without live network calls.

**Input:**  
Service tests.

**Action:**  
Add tests for:

- mock mode uses mock adapter;
- real mode without proxy fails safely;
- unsupported mode does not call provider code;
- existing search results still work in mock mode.

**Expected Result:**  
Adapter routing is safe and test-covered.

**Check:**  
`npm test` passes.

**Size:**  
Medium

---

## Wave 4 — Response Normalization

Goal:

Normalize provider fixture responses into the existing MVP v2 flight shape.

### Task 1: Add Amadeus Fixture

**Goal:**  
Create deterministic sample data for normalization tests.

**Input:**  
Amadeus Flight Offers Search response shape and current normalized contract.

**Action:**  
Create a small fixture file with a simplified Amadeus-like flight offer response that includes:

- two segments;
- one stopover;
- carrier code;
- price total;
- currency;
- departure and arrival times.

**Expected Result:**  
Tests can validate normalization without network calls.

**Check:**  
Fixture contains no real user data or credentials.

**Size:**  
Small

---

### Task 2: Create Amadeus Normalizer

**Goal:**  
Map Amadeus-like provider data into the normalized app shape.

**Input:**  
Fixture data and normalized contract.

**Action:**  
Create:

```text
src/services/normalizers/amadeusFlightNormalizer.js
```

Map provider data into:

```text
id
airline
price
route
segments
duration
availability
```

**Expected Result:**  
The UI can consume normalized offers without knowing provider details.

**Check:**  
Normalizer tests assert exact normalized object fields.

**Size:**  
Medium

---

### Task 3: Handle Missing Optional Provider Fields

**Goal:**  
Avoid UI breakage when provider data is incomplete.

**Input:**  
Normalizer module and fixture variants.

**Action:**  
Add safe defaults for fields that may be missing:

- airline name;
- display price;
- availability seats;
- layover display;
- airport names.

**Expected Result:**  
Normalizer returns stable output even when optional fields are absent.

**Check:**  
Tests cover incomplete fixture input.

**Size:**  
Medium

---

### Task 4: Add Normalization Error Handling

**Goal:**  
Fail safely on malformed provider responses.

**Input:**  
Normalizer module.

**Action:**  
Define how malformed provider data is handled:

- skip invalid offers; or
- throw a controlled normalization error.

Choose one behavior and test it.

**Expected Result:**  
Bad provider data does not crash the UI unpredictably.

**Check:**  
Tests cover malformed fixture input.

**Size:**  
Small

---

## Wave 5 — Real API Request Flow

Goal:

Plan real search request mapping through a backend/serverless proxy and mocked provider responses.

### Task 1: Define Proxy Request Contract

**Goal:**  
Define the frontend-to-proxy payload without implementing provider credentials in frontend.

**Input:**  
Search query shape and Amadeus request requirements.

**Action:**  
Document or implement a request builder that maps:

- from/via/to;
- date range;
- adults;
- layover range;

into a proxy request payload.

**Expected Result:**  
Frontend has a stable request shape for a future proxy endpoint.

**Check:**  
Tests confirm request payload contains no secrets.

**Size:**  
Medium

---

### Task 2: Add Proxy Client Skeleton

**Goal:**  
Create a safe client for calling the future backend/serverless proxy.

**Input:**  
`proxyUrl` config and request contract.

**Action:**  
Create a small proxy client module that:

- requires a configured proxy URL;
- sends search payload to the proxy;
- accepts JSON response;
- does not know provider secrets.

Use mocked fetch in tests.

**Expected Result:**  
Real mode has a frontend-safe network boundary.

**Check:**  
Tests verify proxy URL is required and request body has only user search data.

**Size:**  
Medium

---

### Task 3: Map Proxy Responses Through Normalizer

**Goal:**  
Ensure real-mode responses still become normalized offers.

**Input:**  
Proxy client skeleton and Amadeus normalizer.

**Action:**  
Route mocked proxy responses through the Amadeus normalizer before returning from the adapter.

**Expected Result:**  
`searchFlightOffers` returns normalized data in real mode tests.

**Check:**  
Service tests with mocked fetch return normalized offers.

**Size:**  
Medium

---

### Task 4: Map Real API Errors To Service Errors

**Goal:**  
Convert provider/proxy failures into user-safe service errors.

**Input:**  
Proxy client and existing `searchStatus` UI.

**Action:**  
Map errors for:

- missing proxy URL;
- unauthorized;
- rate limited;
- timeout/network failure;
- empty provider result;
- malformed response.

**Expected Result:**  
Service errors are safe, user-friendly, and do not leak provider internals.

**Check:**  
Tests confirm each failure returns or throws controlled errors.

**Size:**  
Medium

---

## Wave 6 — UI Readiness Pass

Goal:

Verify real-data variations do not break the existing UI.

### Task 1: Add Realistic Normalized UI Fixtures

**Goal:**  
Exercise UI components with data closer to real provider output.

**Input:**  
Normalizer outputs and result card/list tests.

**Action:**  
Add fixture cases for:

- long airline name;
- different currency;
- missing availability;
- long airport names;
- multi-segment display within current one-stop scope.

**Expected Result:**  
UI tests cover real-data variation.

**Check:**  
Result card and results list tests pass with new fixtures.

**Size:**  
Medium

---

### Task 2: Verify Result Card Resilience

**Goal:**  
Ensure result cards handle normalized provider output cleanly.

**Input:**  
`src/components/resultCard.js`.

**Action:**  
Adjust rendering only if needed for:

- missing optional values;
- long text;
- different currencies;
- real carrier names and flight numbers.

**Expected Result:**  
Result cards remain readable and provider-agnostic.

**Check:**  
Tests confirm key fields render and HTML escaping still works.

**Size:**  
Medium

---

### Task 3: Verify Existing Search UX Still Works

**Goal:**  
Protect MVP v2 behavior while adding v3 readiness.

**Input:**  
Existing tests and app state flow.

**Action:**  
Run and update tests only where behavior intentionally changed.

Focus on:

- validation;
- loading;
- service error;
- empty state;
- sorting;
- mock search results.

**Expected Result:**  
MVP v2 user flow still works in mock mode.

**Check:**  
`npm test` passes.

**Size:**  
Small

---

### Task 4: Manual Layout Smoke Check

**Goal:**  
Catch obvious desktop/mobile layout regressions.

**Input:**  
Running Vite app.

**Action:**  
Review:

- desktop layout;
- mobile layout;
- long result card content;
- loading state;
- error state;
- empty state.

**Expected Result:**  
No obvious overlap, clipped controls, or unreadable text.

**Check:**  
Manual smoke result is recorded in workflow or README.

**Size:**  
Small

---

## Wave 7 — RED Test v3

Goal:

Perform final acceptance review for MVP v3 readiness.

### Checklist

- API provider decision documented
- Amadeus-first direction documented
- Duffel retained as secondary candidate
- Schedule/status APIs deferred
- Integration boundary documented
- Backend/serverless proxy boundary documented
- `.env.example` created with safe placeholder values
- No real secrets committed
- No frontend `VITE_` secret variables used
- Mock fallback works
- Adapter selection works
- Amadeus adapter skeleton fails safely when unconfigured
- Proxy client does not include provider secrets
- Response normalization works with fixtures
- Malformed provider responses are handled safely
- Real API request flow works with mocked proxy responses
- Loading state still works
- Error state still works
- Sorting still works
- Results render correctly
- Empty state works
- Mobile layout smoke check recorded
- Desktop layout smoke check recorded
- No console errors recorded during browser smoke check

### Final Verification

**Goal:**  
Confirm MVP v3 is ready for real provider credentials and proxy implementation.

**Input:**  
Completed MVP v3 implementation.

**Action:**  
Run automated tests, production build, secret scan, and final manual acceptance review.

Recommended commands:

```text
npm test
npm run build
rg "AMADEUS|API_SECRET|client_secret|access_token|Bearer" .
```

**Expected Result:**  
MVP v3 passes final review without secrets or UI regressions.

**Check:**  
Final status can be recorded as:

```text
RED TEST v3 = PASSED
Flight Search MVP v3 = READY_FOR_REAL_PROXY_CREDENTIALS
```

**Size:**  
Small

---

## Not Included In MVP v3

- committed API keys
- exposed frontend secrets
- direct browser calls requiring API secrets
- booking
- payment
- ticketing
- user accounts
- saved searches
- favorites
- provider switching UI

---

## Self-Check

- [x] Tasks are small enough
- [x] Each task has a check
- [x] Amadeus-first direction is explicit
- [x] Backend/serverless proxy boundary is explicit
- [x] Mock fallback is preserved
- [x] Existing UI service contract is preserved
- [x] Provider responses are normalized before UI
- [x] No secrets are exposed in frontend code
- [x] No feature creep is introduced
- [x] Plan is ready for Controller review

---

## Send To Controller

Status: READY_FOR_REVIEW  
Version: v1

---

# 10. Handoff To Controller

Controller Agent receives:

- Producer Output v3;
- Analyst Output v3;
- MVP v3 workflow document.

Next expected output:

```text
Controller Output v3
```

---

# 11. Final Producer Status

```text
Producer Output v3 created.
Status: READY_FOR_REVIEW
Next Agent: Controller
```
