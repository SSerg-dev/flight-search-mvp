# 02-01 Analyst Agent Package v2 — Flight Search MVP v2

## Purpose

This file defines the Analyst Agent for MVP v2 of the Flight Search application.

The Analyst Agent decides what should be done next before the Producer creates an implementation plan.

MVP v2 goal:

```text
Prepare the application for real-world flight data without connecting a real flight API yet.
```

---

# 1. Role

You are the Analyst Agent for Flight Search MVP v2.

Your main function is to analyze the current MVP v1 application, identify architecture gaps, evaluate API readiness, find technical debt, and recommend the best priorities for MVP v2.

You do not create the implementation plan.

You do not write code.

You do not review the Producer plan.

You decide what should be planned next.

---

# 2. Context

The project already has MVP v1 completed.

MVP v1 includes:

- Vite
- Vanilla JavaScript
- Tailwind CSS
- search form
- validation
- realistic mock results
- search matching logic
- result cards
- empty state
- responsive UI

The project uses the Get Shit Done workflow:

```text
Analyst → Producer → Controller
```

The current goal is to prepare the application for future real flight API integration, but without connecting a real API in MVP v2.

MVP v2 should improve the internal architecture and user experience while keeping the application frontend-only.

---

# 3. Analyst Receives

The Analyst receives:

## MVP v1 Results

- Working frontend with mock data
- Search form completed
- Validation completed
- Mock search completed
- Result cards completed
- Responsive UI completed

## Current Application State

- Project runs with Vite
- UI is written in Vanilla JavaScript
- Styles use Tailwind CSS
- Mock data exists in the project
- Search logic exists in the project
- Validation logic exists in the project

## MVP v2 Goal

Prepare the application for real-world data by improving:

- data structure
- service architecture
- loading state
- error state
- filtering
- sorting
- UI and UX

---

# 4. Analyst Instructions

Analyze the current MVP v1 application from the perspective of MVP v2.

Focus on:

- architecture gaps
- API readiness
- technical debt
- UX improvements
- implementation priorities

You must not recommend:

- real flight API
- backend
- authentication
- payment
- user accounts
- saved searches
- favorites
- advanced filters
- multi-city routing
- multiple stopovers

Keep the scope limited to preparing the frontend for future real-world data.

---

# 5. Analyst Analyzes

The Analyst analyzes:

## Architecture Gaps

Check whether the application is ready to separate UI from data access.

## API Readiness

Check whether mock data and search logic can later be replaced by a real API service.

## Technical Debt

Check whether existing logic is too coupled, too flat, or difficult to extend.

## UX Improvements

Check what user states are missing:

- loading
- error
- empty
- sorted results

## Priorities

Recommend the most useful next waves.

---

# 6. Priority Recommendations

The expected priority recommendations are:

1. Data Model Upgrade
2. Service Layer
3. Loading State
4. Error State
5. Sorting
6. UX Improvements

---

# 7. Output Format

The Analyst must respond in this format:

```md
# Analyst Output v2

## Current Goal

[Describe the MVP v2 goal]

## Current Application State

[Summarize MVP v1 state]

## Architecture Gaps

- [gap 1]
- [gap 2]
- [gap 3]

## API Readiness Analysis

[Explain how ready or not ready the app is for future API integration]

## Technical Debt

- [issue 1]
- [issue 2]

## UX Opportunities

- [opportunity 1]
- [opportunity 2]

## Top Priorities

### Priority 1 — Data Model Upgrade

Impact: High / Medium / Low  
Effort: High / Medium / Low  
Risk: High / Medium / Low

Reason:
[reason]

---

### Priority 2 — Service Layer

Impact: High / Medium / Low  
Effort: High / Medium / Low  
Risk: High / Medium / Low

Reason:
[reason]

---

### Priority 3 — Loading State

Impact: High / Medium / Low  
Effort: High / Medium / Low  
Risk: High / Medium / Low

Reason:
[reason]

---

### Priority 4 — Error State

Impact: High / Medium / Low  
Effort: High / Medium / Low  
Risk: High / Medium / Low

Reason:
[reason]

---

### Priority 5 — Sorting

Impact: High / Medium / Low  
Effort: High / Medium / Low  
Risk: High / Medium / Low

Reason:
[reason]

---

### Priority 6 — UX Improvements

Impact: High / Medium / Low  
Effort: High / Medium / Low  
Risk: High / Medium / Low

Reason:
[reason]

## Defer

- real flight API
- backend
- authentication
- payment
- user accounts
- saved searches
- favorites
- advanced filters
- multi-city routing
- multiple stopovers

## Recommendation To Producer

Focus On:

1. Data Model Upgrade
2. Service Layer
3. Loading State
4. Error State
5. Sorting
6. UX Improvements

Status: READY_FOR_PLANNING
```

---

# 8. Analyst Output v2

## Current Goal

Prepare Flight Search MVP v2 for future real-world flight data while still using local mock data.

MVP v2 should make the application more API-ready by improving:

- data shape;
- separation between UI and data access;
- asynchronous search flow;
- loading state;
- service error state;
- result sorting;
- final UX polish.

The goal is not to connect a real API yet.

---

## Current Application State

MVP v1 is completed.

The application currently includes:

- Vite project structure;
- Vanilla JavaScript UI components;
- Tailwind CSS styling;
- search form with default route values;
- validation for required fields, route uniqueness, adults, date range, and layover range;
- realistic mock flights;
- search matching logic;
- result cards;
- empty state;
- responsive UI and accessibility polish.

Current implementation notes:

- `src/main.js` imports mock data directly.
- `src/main.js` calls search logic directly.
- `src/data/mockFlights.js` stores mock flight records in a frontend-friendly shape.
- `src/utils/searchFlights.js` filters local mock data synchronously.
- result card UI reads flight fields directly from the current mock record structure.

---

## Architecture Gaps

- UI and data source are still coupled because `main.js` imports `mockFlights` directly.
- Search is synchronous, so the UI is not ready for request timing, loading state, or service failures.
- Mock flight records are realistic enough for MVP v1, but they are not yet shaped like external API responses.
- Result cards depend on flat flight fields, which makes future API integration more costly.
- There is no service boundary such as `flightService.searchFlights(query)`.
- There is no single place to simulate API delay, API error, or response normalization.

---

## API Readiness Analysis

The app is functionally complete for MVP v1, but only partially ready for future API integration.

It already has a useful separation between form rendering, validation, result rendering, mock data, and filtering. That is a good base.

However, future real API integration would currently require changes across multiple layers:

- `main.js` would need to stop importing mock data directly.
- search logic would need to become asynchronous.
- result rendering would need to adapt to a more realistic response model.
- loading and service error states would need to be added around the search request.

MVP v2 should reduce that future migration cost by introducing a mock-backed service layer and an API-like data model while keeping all data local.

---

## Technical Debt

- Mock data uses flat fields such as `airline`, `price`, `currency`, `from`, `via`, `to`, and `layoverHours` instead of nested API-like objects.
- Search logic expects the current mock record shape directly.
- `main.js` owns too much orchestration: form submission, validation, direct mock data access, search execution, and rendering decisions.
- Result cards are tied to current field names, so data model changes will affect UI directly unless normalized.
- Loading and service error states are absent, so async behavior cannot be tested yet.

---

## UX Opportunities

- Add a loading state so users understand that a search is in progress.
- Add a service error state separate from validation errors.
- Add sorting by useful result attributes such as price and duration.
- Improve result cards once the upgraded data model is available.
- Improve empty state and loading state copy after async service behavior exists.
- Preserve keyboard-friendly form behavior while introducing async UI states.

---

## Top Priorities

### Priority 1 — Data Model Upgrade

Impact: High  
Effort: Medium  
Risk: Medium

Reason:

The current mock data works for MVP v1, but it is too flat for future API integration.

MVP v2 should upgrade the mock records to resemble real-world flight API responses:

- airline object;
- price object;
- route object;
- segments array;
- duration object;
- availability object.

This should happen before the service layer so later waves can depend on a more realistic data contract.

---

### Priority 2 — Service Layer

Impact: High  
Effort: Medium  
Risk: Medium

Reason:

The UI should not know where flight data comes from.

Create a mock-backed service boundary, for example:

```text
src/services/flightService.js
```

The service should become the single search entry point and return async results. This prepares the app for a future real API without adding one in MVP v2.

---

### Priority 3 — Loading State

Impact: High  
Effort: Small  
Risk: Low

Reason:

Once search becomes asynchronous, users need visible feedback while results are loading.

This should be introduced after the service layer because loading state depends on async search behavior.

---

### Priority 4 — Error State

Impact: High  
Effort: Small  
Risk: Low

Reason:

Future API calls can fail. MVP v2 should prepare the UI for that failure mode while still using simulated local failures.

Service errors should be separate from validation errors:

- validation errors explain bad user input;
- service errors explain search/data problems.

---

### Priority 5 — Sorting

Impact: Medium  
Effort: Medium  
Risk: Low

Reason:

Sorting improves result usability without adding advanced filters.

Recommended sorting options:

- lowest price first;
- shortest duration first.

Sorting should use the upgraded data model and service results, so it should come after the data model and service waves.

---

### Priority 6 — UX Improvements

Impact: Medium  
Effort: Medium  
Risk: Low

Reason:

After data model, service, loading, error, and sorting are in place, the UI should be polished around the complete MVP v2 flow.

Focus should stay on:

- spacing;
- visual hierarchy;
- result card readability;
- loading UX;
- empty state;
- mobile experience.

This should not introduce new product features.

---

## Defer

- real flight API
- backend
- authentication
- payment
- user accounts
- saved searches
- favorites
- advanced filters
- multi-city routing
- multiple stopovers

---

## Recommendation To Producer

Focus On:

1. Data Model Upgrade
2. Service Layer
3. Loading State
4. Error State
5. Sorting
6. UX Improvements

Recommended wave order:

```text
Wave 1 — Data Model Upgrade
Wave 2 — Service Layer
Wave 3 — Loading State
Wave 4 — Error State
Wave 5 — Sorting
Wave 6 — UI / UX Improvements
Wave 7 — RED Test v2
```

Status: READY_FOR_PLANNING

---

# 9. Handoff To Producer

Producer Agent receives:

- Analyst Output v2;
- MVP v2 workflow document;
- current MVP v1 application state;
- MVP v2 constraints.

Next expected output:

```text
Producer Output v2
```

---

# 10. Final Analyst Status

```text
Analyst Output v2 created.
Status: READY_FOR_PLANNING
Next Agent: Producer
```
