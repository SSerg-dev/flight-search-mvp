# 03-00 Workflow Package — Flight Search MVP v3

## Purpose

This document defines the workflow for MVP v3 of the Flight Search application.

The goal of MVP v3 is to integrate a real flight API while preserving the production-like architecture created in MVP v2.

MVP v3 introduces real API planning and integration, but it must keep mock data available as a safe development fallback.

The project continues to use:

- Analyst Agent
- Producer Agent
- Controller Agent

with manual orchestration.

---

# Current Status

```text
MVP v1: COMPLETED
MVP v2: CODE COMPLETE
MVP v3: WAVE 6 AUTOMATED CHECKS COMPLETE
NEXT_STEP: BROWSER_SMOKE_CHECK
```

---

# Agent Chain

```text
Analyst
↓
Producer
↓
Controller
```

Current orchestrator:

```text
User manually transfers outputs between agents.
```

---

# MVP v3 Goal

Integrate real flight data safely.

Improve:

- API provider selection
- airport metadata source selection
- API integration boundary
- environment configuration
- service adapter architecture
- response normalization
- error handling for real API failures
- mock fallback behavior
- production readiness

while avoiding direct UI coupling to any provider-specific response shape.

---

# Approved Stack

- Vite
- Vanilla JavaScript
- Tailwind CSS
- Node test runner

---

# MVP v3 Constraints

- Do not expose API secrets in frontend code.
- Do not commit real API keys or tokens.
- Keep mock mode available for local development and tests.
- Normalize real API responses into the existing MVP v2 flight result shape.
- Keep UI components provider-agnostic.
- Add tests before relying on real API behavior.
- Treat rate limits, authentication failures, empty results, and network failures as expected states.

---

# Step Plan

```text
Step 1
Finalize 03-00-workflow-flight-search-mvp-v3.md

Step 2
Create 03-01-analyst-agent-package-v3.md

Step 3
Run Analyst v3

Step 4
Create 03-02-producer-agent-package-v3.md

Step 5
Run Producer v3

Step 6
Create 03-03-controller-agent-package-v3.md

Step 7
Run Controller v3

Step 8
Start Wave 1
```

---

# Analyst v3 Input

Analyst receives:

- MVP v2 Results
- Current Application State
- MVP v3 Goal
- Existing service architecture
- Existing normalized mock flight data shape
- Real API integration constraints

---

# Analyst v3 Responsibilities

Analyze:

- real API readiness
- provider options
- frontend security risks
- backend/proxy needs
- service adapter design
- normalization requirements
- failure modes
- implementation priorities

Output:

```text
READY_FOR_PROVIDER_DECISION
```

Priority Recommendations:

1. API Provider Decision
2. Integration Boundary
3. Environment and Secret Strategy
4. Adapter Interface
5. Response Normalization
6. Mock Fallback
7. API Error Handling
8. End-to-End Verification

---

# MVP v3 Waves

## Wave 1 — API Provider Decision + Integration Boundary

Goal:

Choose the real flight API direction and define where provider-specific logic belongs.

Tasks:

- compare API provider candidates
- choose airport metadata source
- choose preferred flight offers provider or shortlist
- decide whether frontend calls a backend/proxy or local mock adapter
- define required environment variables
- define service adapter interface
- define mock fallback mode
- document provider-specific risks

Exit Criteria:

```text
API_PROVIDER_DECISION_READY
INTEGRATION_BOUNDARY_DEFINED
```

Result:

```text
WAVE_1 = COMPLETED
API_PROVIDER_DECISION_READY
INTEGRATION_BOUNDARY_DEFINED
NORMALIZED_FLIGHT_OFFER_CONTRACT_DEFINED
AIRPORT_METADATA_SOURCE_SELECTED
```

Artifacts:

- `.ai/decisions/03-01-api-provider-decision-v3.md`
- `.ai/architecture/03-01-integration-boundary-v3.md`
- `.ai/architecture/03-02-normalized-flight-offer-contract-v3.md`
- `.ai/workflows/03-01-wave-1-exit-checklist-v3.md`

---

## Wave 2 — Environment and Configuration

Goal:

Prepare configuration without exposing secrets.

Tasks:

- define `.env.example`
- define API mode values
- define missing-config behavior
- update README setup instructions
- add tests for config parsing where applicable

Exit Criteria:

```text
CONFIGURATION_READY
```

Result:

```text
WAVE_2 = COMPLETED
CONFIGURATION_READY
MOCK_MODE_DEFAULT_READY
FRONTEND_SECRET_SAFETY_READY
```

Artifacts:

- `.env.example`
- `src/config/apiConfig.js`
- `test/apiConfig.test.js`
- `.ai/workflows/03-02-wave-2-exit-checklist-v3.md`

---

## Wave 3 — API Adapter Skeleton

Goal:

Create a provider-agnostic service boundary.

Tasks:

- create real API adapter module
- keep mock adapter module
- route service calls through selected adapter
- preserve existing `searchFlightOffers` behavior for the UI
- add tests for adapter selection

Exit Criteria:

```text
ADAPTER_BOUNDARY_READY
```

Result:

```text
WAVE_3 = COMPLETED
ADAPTER_BOUNDARY_READY
MOCK_ADAPTER_READY
AMADEUS_ADAPTER_SKELETON_READY
```

Artifacts:

- `src/services/adapters/mockFlightAdapter.js`
- `src/services/adapters/amadeusFlightAdapter.js`
- `src/services/flightService.js`
- `test/flightService.test.js`
- `.ai/workflows/03-03-wave-3-exit-checklist-v3.md`

---

## Wave 4 — Response Normalization

Goal:

Convert real provider responses into the existing MVP v2 flight shape.

Tasks:

- define normalized flight result contract
- add provider response fixtures
- map airline data
- map price data
- map route data
- map segments data
- map duration and layover data
- map availability data when available
- add normalization tests

Exit Criteria:

```text
NORMALIZATION_READY
```

Result:

```text
WAVE_4 = COMPLETED
NORMALIZATION_READY
AMADEUS_FIXTURE_READY
AMADEUS_NORMALIZER_READY
```

Artifacts:

- `test/fixtures/amadeusFlightOffers.js`
- `src/services/normalizers/amadeusFlightNormalizer.js`
- `test/amadeusFlightNormalizer.test.js`
- `.ai/workflows/03-01-wave-4-exit-checklist-v3.md`

---

## Wave 5 — Real API Request Flow

Goal:

Connect real search requests through the adapter boundary.

Tasks:

- build request payload/query mapping
- handle authentication requirements
- handle rate limits
- handle empty provider responses
- handle network failures
- preserve existing loading and error UX
- add service tests with mocked API responses

Exit Criteria:

```text
REAL_API_FLOW_READY
```

Result:

```text
WAVE_5 = COMPLETED
REAL_API_FLOW_READY
PROXY_REQUEST_CONTRACT_READY
PROXY_CLIENT_SKELETON_READY
MOCKED_AMADEUS_FLOW_READY
```

Artifacts:

- `src/services/proxy/amadeusProxyClient.js`
- `src/services/adapters/amadeusFlightAdapter.js`
- `test/amadeusProxyClient.test.js`
- `test/flightService.test.js`
- `.ai/workflows/03-02-wave-5-exit-checklist-v3.md`

---

## Wave 6 — UI Readiness Pass

Goal:

Ensure real data variations do not break the UI.

Tasks:

- verify long airline names
- verify multi-segment routes
- verify missing optional fields
- verify different currencies
- verify empty results
- verify service errors
- verify mobile layout
- verify desktop layout

Exit Criteria:

```text
UI_READY_FOR_REAL_DATA
```

Result:

```text
WAVE_6 = AUTOMATED_CHECKS_COMPLETED
UI_AUTOMATED_READINESS_READY
BROWSER_SMOKE_CHECK_PENDING
```

Artifacts:

- `test/fixtures/normalizedFlightOffers.js`
- `test/resultsList.test.js`
- `src/components/resultCard.js`
- `src/components/resultsList.js`
- `.ai/workflows/03-03-wave-6-exit-checklist-v3.md`

Pending:

- Desktop layout smoke check
- Mobile layout smoke check
- Browser console error check

---

## Wave 7 — RED Test v3

Checklist:

- API provider decision documented
- integration boundary documented
- environment configuration documented
- mock fallback works
- adapter selection works
- response normalization works
- real API request flow works with mocked responses
- loading state works
- error state works
- sorting still works
- results render correctly
- empty state works
- mobile layout works
- desktop layout works
- no console errors
- no secrets committed

Result:

```text
RED TEST v3 = WAVE 6 AUTOMATED CHECKS COMPLETE

Flight Search MVP v3 = BROWSER_SMOKE_CHECK_PENDING

READY_FOR_BROWSER_VERIFICATION
```

---

# Expected Outcome

```text
MVP v1
↓
Working frontend with mock data

MVP v2
↓
Production-like architecture ready for real data

MVP v3
↓
Real Flight API integration through a safe adapter boundary
```
