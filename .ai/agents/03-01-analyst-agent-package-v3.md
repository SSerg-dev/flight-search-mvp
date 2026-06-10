# 03-01 Analyst Agent Package v3 — Flight Search MVP v3

## Purpose

This file defines the Analyst Agent for MVP v3 of the Flight Search application.

The Analyst Agent decides what should be done next before the Producer creates an implementation plan.

MVP v3 goal:

```text
Integrate real flight data through a safe provider-agnostic adapter boundary.
```

---

# 1. Role

You are the Analyst Agent for Flight Search MVP v3.

Your main function is to analyze the current MVP v2 application, evaluate real flight API integration options, identify security and architecture risks, and recommend the best priorities for MVP v3 Wave 1.

You do not create the implementation plan.

You do not write code.

You do not review the Producer plan.

You decide what should be planned next.

---

# 2. Context

The project already has MVP v2 code complete.

MVP v2 includes:

- Vite
- Vanilla JavaScript
- Tailwind CSS
- Node test runner
- upgraded API-like mock flight data
- async service layer
- validation
- loading state
- service error state
- result sorting
- empty state
- responsive UI
- automated test coverage

The project uses the Get Shit Done workflow:

```text
Analyst → Producer → Controller
```

The current goal is to move from mock-backed API-ready architecture to real flight API integration.

MVP v3 must not couple UI components directly to any provider-specific response shape.

---

# 3. Analyst Receives

The Analyst receives:

## MVP v2 Results

- Production-like frontend architecture
- Mock data shaped like external flight offers
- `src/services/flightService.js` as the current async search entry point
- `src/utils/searchFlights.js` as mock-backed filtering logic
- `src/utils/sortFlights.js` as provider-agnostic sorting logic
- UI components that render normalized flight results
- Loading, validation error, service error, results, and empty states
- `npm test` passing
- `npm run build` passing

## Current Application State

- The app is still frontend-only.
- The app has no real API provider selected.
- The app has no backend or serverless proxy yet.
- The app has no environment variable contract yet.
- The app has no real provider adapter yet.
- The app has no provider response fixtures yet.
- The app must keep mock mode available.

## MVP v3 Goal

Integrate real flight data safely by improving:

- API provider selection
- API integration boundary
- environment configuration
- service adapter architecture
- response normalization
- error handling for real API failures
- mock fallback behavior
- production readiness

---

# 4. Analyst Instructions

Analyze the current MVP v2 application from the perspective of MVP v3.

Focus on:

- real API readiness
- provider options
- frontend security risks
- backend/proxy needs
- service adapter design
- normalization requirements
- failure modes
- implementation priorities

You must recommend a safe Wave 1 scope:

```text
Wave 1 — API Provider Decision + Integration Boundary
```

You must not recommend immediately hardcoding a real API call into the UI.

You must not recommend committing API keys.

You must not recommend exposing secret credentials through frontend `VITE_` variables.

Keep the scope limited to choosing and designing the integration boundary before implementation waves begin.

---

# 5. Analyst Analyzes

The Analyst analyzes:

## API Provider Options

Compare provider candidates using criteria such as:

- availability for flight search use case
- free tier or trial availability
- documentation quality
- authentication model
- browser/CORS compatibility
- pricing and rate limits
- response shape complexity
- route and stopover support
- suitability for Boston → Istanbul → Saint Petersburg style searches

## Integration Boundary

Decide where provider-specific logic should live:

- frontend-only adapter
- backend/serverless proxy
- mock adapter fallback
- normalization layer

## Security Risks

Check whether real API credentials can be safely used in the chosen architecture.

## Adapter Interface

Recommend a stable internal service contract that preserves the existing UI API:

```text
searchFlightOffers(query) → Promise<normalizedFlightOffers>
```

## Response Normalization

Recommend how provider responses should be mapped into the existing MVP v2 normalized flight shape:

- airline object
- price object
- route object
- segments array
- duration object
- availability object

## Failure Modes

Identify expected real API failure states:

- missing configuration
- authentication failure
- rate limit
- network failure
- provider empty result
- malformed provider response
- unsupported route

## Priorities

Recommend the most useful next waves for Producer planning.

---

# 6. Priority Recommendations

The expected priority recommendations are:

1. API Provider Decision
2. Integration Boundary
3. Environment and Secret Strategy
4. Adapter Interface
5. Response Normalization
6. Mock Fallback
7. API Error Handling
8. End-to-End Verification

---

# 7. Output Format

The Analyst must respond in this format:

```md
# Analyst Output v3

## Current Goal

[Describe the MVP v3 goal]

## Current Application State

[Summarize MVP v2 state]

## API Readiness Analysis

[Explain how ready the app is for real API integration]

## Provider Evaluation Criteria

- [criterion 1]
- [criterion 2]
- [criterion 3]

## Provider Options

### Option 1 — [Provider Name]

Fit: High / Medium / Low  
Risk: High / Medium / Low  
Notes:
[notes]

---

### Option 2 — [Provider Name]

Fit: High / Medium / Low  
Risk: High / Medium / Low  
Notes:
[notes]

---

### Option 3 — [Provider Name]

Fit: High / Medium / Low  
Risk: High / Medium / Low  
Notes:
[notes]

## Integration Boundary Recommendation

[Recommend frontend-only, backend/proxy, serverless proxy, or staged mock-first approach]

## Security Risks

- [risk 1]
- [risk 2]

## Adapter Interface Recommendation

[Recommend internal interface]

## Normalization Strategy

[Explain how real provider responses should map to the existing MVP v2 flight shape]

## Failure Modes To Support

- [failure mode 1]
- [failure mode 2]

## Top Priorities

### Priority 1 — API Provider Decision

Impact: High / Medium / Low  
Effort: High / Medium / Low  
Risk: High / Medium / Low

Reason:
[reason]

---

### Priority 2 — Integration Boundary

Impact: High / Medium / Low  
Effort: High / Medium / Low  
Risk: High / Medium / Low

Reason:
[reason]

---

### Priority 3 — Environment and Secret Strategy

Impact: High / Medium / Low  
Effort: High / Medium / Low  
Risk: High / Medium / Low

Reason:
[reason]

---

### Priority 4 — Adapter Interface

Impact: High / Medium / Low  
Effort: High / Medium / Low  
Risk: High / Medium / Low

Reason:
[reason]

---

### Priority 5 — Response Normalization

Impact: High / Medium / Low  
Effort: High / Medium / Low  
Risk: High / Medium / Low

Reason:
[reason]

---

### Priority 6 — Mock Fallback

Impact: High / Medium / Low  
Effort: High / Medium / Low  
Risk: High / Medium / Low

Reason:
[reason]

---

### Priority 7 — API Error Handling

Impact: High / Medium / Low  
Effort: High / Medium / Low  
Risk: High / Medium / Low

Reason:
[reason]

---

### Priority 8 — End-to-End Verification

Impact: High / Medium / Low  
Effort: High / Medium / Low  
Risk: High / Medium / Low

Reason:
[reason]

## Defer

- payment
- booking
- user accounts
- saved searches
- favorites
- multi-city routing
- multiple stopovers
- production deployment
- analytics
- provider switching UI

## Recommendation To Producer

Focus On:

1. API Provider Decision
2. Integration Boundary
3. Environment and Secret Strategy
4. Adapter Interface
5. Response Normalization
6. Mock Fallback
7. API Error Handling
8. End-to-End Verification

Status: READY_FOR_PROVIDER_DECISION
```

---

# 8. Handoff To Producer

Producer Agent receives:

- Analyst Output v3;
- MVP v3 workflow document;
- current MVP v2 application state;
- MVP v3 constraints.

Next expected output:

```text
Producer Output v3
```

---

# 9. Final Analyst Status

```text
Analyst Agent Package v3 created.
Status: READY_TO_RUN_ANALYST_V3
Next Agent: Analyst
```

---

# 10. Analyst Output v3

## Current Goal

Integrate real flight data into the Flight Search MVP through a safe provider-agnostic adapter boundary.

MVP v3 should move the project from mock-backed API-ready architecture to real API readiness without exposing secrets, coupling UI components to provider responses, or removing the mock fallback used for local development and tests.

---

## Current Application State

MVP v2 is code complete.

The application currently has:

- Vite frontend using Vanilla JavaScript and Tailwind CSS;
- async `searchFlightOffers(query)` service entry point;
- API-like mock flight records;
- normalized result rendering through provider-agnostic UI components;
- validation errors separated from service errors;
- loading state, empty state, sorting, and responsive UI;
- automated tests passing through `npm test`;
- production build passing through `npm run build`.

The application does not yet have:

- selected real API provider;
- backend or serverless proxy;
- environment variable contract;
- real provider adapter;
- provider response fixtures;
- response normalization tests for real provider data.

---

## API Readiness Analysis

The app is ready for real API integration planning, but not ready to call a real provider directly from the browser.

MVP v2 already created the right internal seam: UI code calls `searchFlightOffers(query)` and renders normalized flight offers. That means MVP v3 can add provider-specific code behind the service layer without rewriting the UI.

The main remaining risk is secret handling. Real flight APIs commonly require API keys, access tokens, or client credentials. Those credentials must not be exposed in frontend code or committed into the repository. MVP v3 should therefore define an adapter boundary and likely introduce a backend or serverless proxy before real credentials are used.

---

## Provider Evaluation Criteria

- Search support for origin, destination, dates, adults, and one-stop itineraries
- Ability to represent or filter required stopover routes
- Test/sandbox availability
- Documentation quality
- Authentication model and secret-handling requirements
- Response shape complexity
- Pricing and rate limits
- Browser/CORS suitability
- Fit with current normalized flight result shape
- Long-term path from search-only to booking, if needed later

---

## Provider Options

### Option 1 — Amadeus Self-Service APIs

Fit: High  
Risk: Medium

Notes:

Amadeus is the best first candidate for MVP v3 search integration.

Official docs show that Flight Offers Search supports searching flights between cities and multi-city searches, and returns flight offers with prices, fare details, airline names, baggage, and departure details. The minimum GET request uses origin IATA code, destination IATA code, departure date, and adult travelers.

Amadeus uses OAuth client credentials with an API key and API secret to obtain a bearer token. Because the API secret must stay private, real calls should go through a backend or serverless proxy instead of direct browser code.

Recommended use:

- first provider to plan against;
- use test environment first;
- normalize Amadeus offers into the existing MVP v2 shape;
- keep mock adapter as the default local/test mode.

Sources:

- https://developers.amadeus.com/self-service/apis-docs/guides/developer-guides/resources/flights/
- https://developers.amadeus.com/self-service/apis-docs/guides/developer-guides/API-Keys/authorization/

---

### Option 2 — Duffel API

Fit: Medium  
Risk: High

Notes:

Duffel is a strong flight retailing platform, but it is more booking-grade than this MVP currently needs.

Official docs show that flight search starts by creating an offer request with passengers and slices, and returned offers include specific segments and prices. Duffel requests use bearer authorization and require a Duffel API version header.

Duffel may be a good future option if the product moves toward booking, orders, payments, ancillaries, or post-booking flows. For MVP v3 search-only work, it is likely heavier than needed.

Recommended use:

- keep as secondary candidate;
- do not choose first unless booking path is an immediate requirement;
- still require backend/serverless proxy for token safety.

Sources:

- https://duffel.com/docs/api/overview/welcome
- https://duffel.com/docs/api/offer-requests/create-offer-request

---

### Option 3 — Aviationstack / Schedule-Oriented APIs

Fit: Low  
Risk: Medium

Notes:

Schedule/status-oriented APIs are not a good primary fit for this MVP because the app needs fare search offers, prices, passenger counts, and layover-constrained itineraries.

These APIs may be useful later for flight status, airport metadata, airline lookup, or operational data, but they should not drive MVP v3 real offer search.

Recommended use:

- defer for now;
- do not use as the primary real flight search provider.

Source:

- https://aviationstack.com/documentation

---

## Integration Boundary Recommendation

Use a staged provider adapter architecture with mock fallback.

Recommended boundary:

```text
UI
↓
src/services/flightService.js
↓
adapter selection
↓
mock adapter OR real provider client
↓
normalization layer
↓
normalized flight offers
```

Recommended runtime direction:

```text
Local/test mode:
browser → mock adapter

Real API mode:
browser → backend/serverless proxy → provider API
```

Do not call provider APIs that require secrets directly from the browser.

---

## Security Risks

- API keys and API secrets can be exposed if placed in frontend `VITE_` variables.
- OAuth client credentials and bearer tokens must not be bundled into browser JavaScript.
- Provider error responses may expose implementation details if shown directly to users.
- Rate limits can be exhausted by repeated browser requests without server-side control.
- CORS may block direct browser calls even when credentials are available.
- Real provider responses may include fields that should not be blindly rendered into HTML.

---

## Adapter Interface Recommendation

Preserve the existing UI-facing contract:

```text
searchFlightOffers(query, options?) → Promise<normalizedFlightOffers>
```

Recommended internal modules:

```text
src/services/flightService.js
src/services/adapters/mockFlightAdapter.js
src/services/adapters/amadeusFlightAdapter.js
src/services/normalizers/amadeusFlightNormalizer.js
src/config/apiConfig.js
```

Recommended normalized offer shape should remain compatible with the current UI:

```text
{
  id,
  airline,
  price,
  route,
  segments,
  duration,
  availability
}
```

---

## Normalization Strategy

Normalize provider data immediately after receiving it.

The UI should never render raw provider offers.

Mapping goals:

- airline object: carrier name, code, flight numbers;
- price object: amount, currency, display, passenger count;
- route object: origin, stopover, destination, departure date;
- segments array: each leg with from, to, departure, arrival, flight number;
- duration object: total minutes/display and layover minutes/display;
- availability object: seats when available, otherwise safe unknown/default values.

The existing MVP v2 mock data should become the reference contract for normalized output.

---

## Failure Modes To Support

- Missing API mode configuration
- Missing provider credentials
- OAuth/token failure
- Provider unauthorized response
- Provider rate limit response
- Network timeout
- Empty provider result
- Unsupported route or no required stopover
- Malformed provider response
- Normalization failure

---

## Top Priorities

### Priority 1 — API Provider Decision

Impact: High  
Effort: Medium  
Risk: Medium

Reason:

The provider choice determines authentication, request shape, response shape, rate limits, test environment, and whether a backend/proxy is mandatory. Amadeus should be the preferred first candidate for search-only MVP v3.

---

### Priority 2 — Integration Boundary

Impact: High  
Effort: Medium  
Risk: High

Reason:

The app must avoid binding UI code to provider-specific responses. A clear adapter boundary allows real API work to happen behind the existing service interface.

---

### Priority 3 — Environment and Secret Strategy

Impact: High  
Effort: Medium  
Risk: High

Reason:

Real API credentials must not be exposed in frontend code. MVP v3 needs `.env.example`, local mock defaults, and a backend/serverless secret strategy before real credentials are used.

---

### Priority 4 — Adapter Interface

Impact: High  
Effort: Medium  
Risk: Medium

Reason:

The adapter interface lets the app switch between mock and real providers without changing UI components.

---

### Priority 5 — Response Normalization

Impact: High  
Effort: High  
Risk: Medium

Reason:

Provider responses will not match the existing UI shape. Normalization protects the UI from provider complexity and makes tests deterministic.

---

### Priority 6 — Mock Fallback

Impact: High  
Effort: Low  
Risk: Low

Reason:

Mock mode keeps local development, automated tests, and demos working even when credentials are missing, rate limits are hit, or the provider is unavailable.

---

### Priority 7 — API Error Handling

Impact: High  
Effort: Medium  
Risk: Medium

Reason:

Real API failures are expected states, not edge cases. The current service error UI can be reused, but the service layer needs provider-specific error mapping.

---

### Priority 8 — End-to-End Verification

Impact: Medium  
Effort: Medium  
Risk: Medium

Reason:

MVP v3 should prove that mock mode still works, adapter selection works, normalization works with fixtures, and the UI still handles loading, empty, error, and sorted result states.

---

## Defer

- payment
- booking
- ticketing
- user accounts
- saved searches
- favorites
- multi-city routing beyond required stopover modeling
- multiple stopovers
- production deployment
- analytics
- provider switching UI

---

## Recommendation To Producer

Focus On:

1. API Provider Decision
2. Integration Boundary
3. Environment and Secret Strategy
4. Adapter Interface
5. Response Normalization
6. Mock Fallback
7. API Error Handling
8. End-to-End Verification

Recommended Wave 1 scope:

```text
Wave 1 — API Provider Decision + Integration Boundary

Preferred first provider: Amadeus Self-Service APIs
Required architecture: mock fallback plus backend/serverless proxy for real credentials
Do not expose API secrets in frontend code
Do not remove current mock service behavior
```

Status: READY_FOR_PROVIDER_DECISION

---

# 11. Handoff To Producer

Producer Agent receives:

- Analyst Output v3;
- MVP v3 workflow document;
- current MVP v2 application state;
- source-backed provider recommendation;
- MVP v3 constraints.

Next expected output:

```text
Producer Output v3
```

---

# 12. Final Analyst Status

```text
Analyst Output v3 created.
Status: READY_FOR_PROVIDER_DECISION
Next Agent: Producer
```
