# 02-02 Producer Agent Package v2 — Flight Search MVP v2

## Purpose

This file defines the Producer Agent for MVP v2 of the Flight Search application.

The Producer Agent turns Analyst Output v2 and Workflow v2 into a small, executable, reviewable implementation plan.

---

# 1. Role

You are the Producer Agent for Flight Search MVP v2.

Your main function is to create a small, wave-based implementation plan that prepares the application for real-world flight data without connecting a real flight API.

You do not write code.

You do not review the plan as Controller.

You create the plan that will be reviewed by Controller Agent.

---

# 2. Context

The project already has MVP v1 completed.

Current workflow:

```text
Analyst → Producer → Controller
```

MVP v2 goal:

```text
Prepare the application for real-world flight data while continuing to use mock data.
```

Approved stack:

- Vite
- Vanilla JavaScript
- Tailwind CSS

MVP v2 must not include:

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

# 3. Producer Receives

Producer receives:

## Analyst Output v2

Expected Analyst recommendations:

1. Data Model Upgrade
2. Service Layer
3. Loading State
4. Error State
5. Sorting
6. UX Improvements

## Workflow v2

Workflow file:

```text
02-00-workflow-flight-search-mvp-v2.md
```

Workflow waves:

1. Data Model Upgrade
2. Service Layer
3. Loading State
4. Error State
5. Sorting
6. UI / UX Improvements
7. RED Test v2

---

# 4. Producer Instructions

Create a detailed implementation plan for MVP v2.

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

---

# 5. Producer Creates

Producer creates:

## Wave 1 — Data Model Upgrade

Goal:

```text
Make mock data resemble real-world API responses.
```

## Wave 2 — Service Layer

Goal:

```text
Separate UI from the data source.
```

## Wave 3 — Loading State

Goal:

```text
Prepare UI for asynchronous requests.
```

## Wave 4 — Error State

Goal:

```text
Prepare UI for service failures.
```

## Wave 5 — Sorting

Goal:

```text
Improve result usability.
```

## Wave 6 — UI / UX Improvements

Goal:

```text
Improve application usability and production-like feel.
```

## Wave 7 — RED Test v2

Goal:

```text
Perform final acceptance review for MVP v2.
```

---

# 6. Output Format

The Producer must respond in this format:

```md
# Producer Output v2

## Project

Flight Search MVP v2

## Goal

Prepare the application for real-world flight data without connecting a real API.

## Source Inputs

- Analyst Output v2
- 02-00-workflow-flight-search-mvp-v2.md

## Implementation Plan

---

## Wave 1 — Data Model Upgrade

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

## Wave 2 — Service Layer

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

## Wave 3 — Loading State

[Tasks]

---

## Wave 4 — Error State

[Tasks]

---

## Wave 5 — Sorting

[Tasks]

---

## Wave 6 — UI / UX Improvements

[Tasks]

---

## Wave 7 — RED Test v2

[Checklist]

---

## Not Included In MVP v2

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

## Self-Check

- [ ] Tasks are small enough
- [ ] Each task has a check
- [ ] API-ready architecture is prepared
- [ ] No real API is included
- [ ] No backend is included
- [ ] MVP scope is respected
- [ ] No feature creep is introduced
- [ ] Plan is ready for Controller review

## Send To Controller

Status: READY_FOR_REVIEW  
Version: v1
```

---

# 7. Producer Output v2

## Project

Flight Search MVP v2

## Goal

Prepare the application for real-world flight data without connecting a real API.

MVP v2 keeps the app frontend-only and mock-data-backed, but introduces a more production-like internal structure.

---

## Source Inputs

- Analyst Output v2
- `.ai/workflows/02-00-workflow-flight-search-mvp-v2.md`
- current MVP v1 application state

---

## Implementation Plan

---

## Wave 1 — Data Model Upgrade

Goal:

Make mock data resemble real-world API responses.

### Task 1: Redesign Mock Flight Structure

**Goal:**  
Replace the flat MVP v1 mock flight structure with an API-like structure.

**Input:**  
`src/data/mockFlights.js`

**Action:**  
Restructure each mock flight record to include:

- `id`
- `airline`
- `price`
- `route`
- `segments`
- `duration`
- `availability`

**Expected Result:**  
Mock data becomes closer to a future API response and no longer depends only on flat fields like `from`, `via`, `to`, `price`, and `layoverHours`.

**Check:**  
Tests confirm that each mock flight has nested `airline`, `price`, `route`, `segments`, `duration`, and `availability` objects.

**Size:**  
Medium

---

### Task 2: Add Airline Object

**Goal:**  
Represent airline details in a realistic object.

**Input:**  
Updated mock flight records.

**Action:**  
Add an `airline` object to each mock flight:

```text
airline.name
airline.code
airline.flightNumbers
```

**Expected Result:**  
Flight cards can read airline data from a structured field.

**Check:**  
Tests confirm airline name, code, and flight numbers exist for every mock flight.

**Size:**  
Small

---

### Task 3: Add Price Object

**Goal:**  
Represent price data in an API-like shape.

**Input:**  
Updated mock flight records.

**Action:**  
Add a `price` object:

```text
price.amount
price.currency
price.display
price.passengerCount
```

**Expected Result:**  
Price rendering no longer depends on separate flat `price`, `currency`, and `pricedForAdults` fields.

**Check:**  
Tests confirm result cards render price from the nested `price` object.

**Size:**  
Small

---

### Task 4: Add Route And Segments Objects

**Goal:**  
Represent route and itinerary data in a future API-ready format.

**Input:**  
Updated mock flight records.

**Action:**  
Add:

```text
route.origin
route.stopover
route.destination
route.departureDate
segments[]
```

Each segment should include:

```text
from
to
departure
arrival
flightNumber
```

**Expected Result:**  
Search and cards can use `route` and `segments` instead of flat route fields.

**Check:**  
Tests confirm each mock flight has one mandatory stopover route and exactly two segments.

**Size:**  
Medium

---

### Task 5: Add Duration And Availability Objects

**Goal:**  
Represent layover, total duration, and seat availability in structured fields.

**Input:**  
Updated mock flight records.

**Action:**  
Add:

```text
duration.totalMinutes
duration.display
duration.layoverMinutes
duration.layoverDisplay
availability.seats
availability.canBookAdults
```

**Expected Result:**  
Search logic can compare numeric duration/layover values while UI can render display strings.

**Check:**  
Tests confirm layover filtering and adults matching use `duration.layoverMinutes` and `availability.seats`.

**Size:**  
Medium

---

### Task 6: Update Result Cards For New Data Model

**Goal:**  
Make result cards render the upgraded data model.

**Input:**  
`src/components/resultCard.js` and upgraded mock flights.

**Action:**  
Update result card rendering to read from nested objects:

- `flight.airline`
- `flight.price`
- `flight.route`
- `flight.segments`
- `flight.duration`
- `flight.availability`

**Expected Result:**  
Result cards display the same user-facing information as MVP v1 using the upgraded model.

**Check:**  
Existing result card tests pass after being updated for the new model.

**Size:**  
Medium

---

## Wave 2 — Service Layer

Goal:

Separate UI from the data source.

### Task 1: Create Flight Service Module

**Goal:**  
Create a single data-access boundary for flight search.

**Input:**  
Current `src/utils/searchFlights.js` and `src/data/mockFlights.js`.

**Action:**  
Create:

```text
src/services/flightService.js
```

Export an async search function:

```text
searchFlightOffers(query)
```

**Expected Result:**  
UI has one service entry point for flight results.

**Check:**  
Tests can import `searchFlightOffers` and receive a Promise.

**Size:**  
Small

---

### Task 2: Move Search Entry Point Into Service Layer

**Goal:**  
Stop `main.js` from importing mock data directly.

**Input:**  
`src/main.js`, `src/services/flightService.js`, `src/utils/searchFlights.js`.

**Action:**  
Update `main.js` to call the service instead of importing `mockFlights` and calling `searchFlights` directly.

**Expected Result:**  
`main.js` no longer knows where flight data comes from.

**Check:**  
Search still returns matching results, and `main.js` does not import `src/data/mockFlights.js`.

**Size:**  
Medium

---

### Task 3: Return Async Results

**Goal:**  
Prepare the search flow for real API behavior.

**Input:**  
`src/services/flightService.js`

**Action:**  
Make the service return results asynchronously with a Promise.

**Expected Result:**  
Search callers must use `await` or `.then`.

**Check:**  
Tests confirm service results are awaited and match the expected route.

**Size:**  
Small

---

### Task 4: Simulate API Behavior

**Goal:**  
Centralize mock API behavior in the service layer.

**Input:**  
`src/services/flightService.js`

**Action:**  
Add a small mock delay inside the service.

**Expected Result:**  
The app behaves like it is waiting for a remote search without using a real API.

**Check:**  
Tests can configure or verify async service behavior without making network calls.

**Size:**  
Small

---

## Wave 3 — Loading State

Goal:

Prepare UI for asynchronous requests.

### Task 1: Add Search Loading State

**Goal:**  
Track whether a search request is in progress.

**Input:**  
`src/main.js`

**Action:**  
Add state handling so the UI can render while the service Promise is pending.

**Expected Result:**  
Submitting a valid form can render a loading state before results appear.

**Check:**  
Tests confirm loading markup can be rendered independently.

**Size:**  
Medium

---

### Task 2: Add Loading Indicator Component

**Goal:**  
Display a clear loading message for search requests.

**Input:**  
Current component structure.

**Action:**  
Create or update a component to render:

```text
Searching mock flight offers...
```

**Expected Result:**  
User sees feedback during async search.

**Check:**  
Tests confirm the loading message appears when loading state is true.

**Size:**  
Small

---

### Task 3: Disable Submit Button While Loading

**Goal:**  
Prevent duplicate search submissions while a request is pending.

**Input:**  
`src/components/searchForm.js` and app state.

**Action:**  
Allow the form component to receive an `isLoading` option and disable the submit button while loading.

**Expected Result:**  
Keyboard and mouse users cannot submit duplicate searches while loading.

**Check:**  
Tests confirm submit button renders `disabled` and loading text while `isLoading` is true.

**Size:**  
Small

---

## Wave 4 — Error State

Goal:

Prepare UI for service failures.

### Task 1: Add Service Error State

**Goal:**  
Track non-validation errors separately from form validation errors.

**Input:**  
`src/main.js`

**Action:**  
Add state for service/search errors.

**Expected Result:**  
The app can show an error from the search service without marking form inputs invalid.

**Check:**  
Tests confirm service errors are rendered separately from validation errors.

**Size:**  
Medium

---

### Task 2: Render User-Friendly Search Error

**Goal:**  
Show clear error text when the service fails.

**Input:**  
Current results/empty/loading UI area.

**Action:**  
Render an error message such as:

```text
We could not load flight results. Please try again.
```

**Expected Result:**  
User sees a helpful message instead of a broken UI.

**Check:**  
Tests confirm service error markup renders with accessible alert semantics.

**Size:**  
Small

---

### Task 3: Simulate Service Failure

**Goal:**  
Allow local tests to exercise the error state.

**Input:**  
`src/services/flightService.js`

**Action:**  
Add a controlled way for tests to simulate a service failure without network calls.

**Expected Result:**  
Error state can be tested repeatably.

**Check:**  
Tests confirm a simulated failure rejects with a controlled error.

**Size:**  
Small

---

## Wave 5 — Sorting

Goal:

Improve result usability.

### Task 1: Add Sort State

**Goal:**  
Track the selected result sort order.

**Input:**  
`src/main.js`

**Action:**  
Add state for selected sort option.

**Expected Result:**  
The app can preserve and apply the selected sort order after search.

**Check:**  
Tests confirm default sort state exists and can be changed.

**Size:**  
Small

---

### Task 2: Add Sorting Utility

**Goal:**  
Sort flight results by supported criteria.

**Input:**  
Upgraded flight data model.

**Action:**  
Create a sorting utility or service helper that supports:

- price low to high;
- duration short to long.

**Expected Result:**  
Sorting does not mutate the original result array.

**Check:**  
Tests confirm price and duration sorting order.

**Size:**  
Medium

---

### Task 3: Add Sorting Dropdown

**Goal:**  
Let users choose result order.

**Input:**  
Results UI.

**Action:**  
Add a simple select control with:

```text
Sort by price
Sort by duration
```

**Expected Result:**  
Users can choose how matching results are ordered.

**Check:**  
Tests confirm dropdown markup exists and uses accessible label text.

**Size:**  
Medium

---

## Wave 6 — UI / UX Improvements

Goal:

Improve application usability and production-like feel.

### Task 1: Improve Result Card Hierarchy

**Goal:**  
Make upgraded result cards easier to scan.

**Input:**  
`src/components/resultCard.js`

**Action:**  
Improve grouping for airline, route, segment timing, layover, duration, price, and availability.

**Expected Result:**  
Result cards feel production-like while staying within the existing MVP scope.

**Check:**  
Tests confirm result cards still render airline, route, price, duration, layover, and availability.

**Size:**  
Medium

---

### Task 2: Improve Loading And Empty States

**Goal:**  
Make system states clearer and more consistent.

**Input:**  
Loading, empty, and error UI.

**Action:**  
Polish copy, spacing, and visual treatment for loading and empty states.

**Expected Result:**  
Loading and empty states are readable on mobile and desktop.

**Check:**  
Tests confirm loading and empty states still render expected user-facing text.

**Size:**  
Small

---

### Task 3: Improve Mobile Layout

**Goal:**  
Make MVP v2 comfortable on narrow screens.

**Input:**  
Current Tailwind layout classes.

**Action:**  
Adjust spacing and stacking for form, sorting controls, status messages, and result cards.

**Expected Result:**  
Mobile layout remains readable after MVP v2 additions.

**Check:**  
Manual review at mobile width confirms no obvious overlap or cramped controls.

**Size:**  
Medium

---

### Task 4: Final Cleanup

**Goal:**  
Prepare MVP v2 for final review.

**Input:**  
All MVP v2 files.

**Action:**  
Remove unused imports, verify file names, check component boundaries, and ensure no placeholder errors remain.

**Expected Result:**  
Project structure is clean and implementation remains frontend-only.

**Check:**  
Run `node --test`, `npm run build`, and scan for placeholders such as `TODO` or `will be implemented`.

**Size:**  
Small

---

## Wave 7 — RED Test v2

Goal:

Perform final acceptance review for MVP v2.

### Checklist

- Data model upgraded
- Service layer works
- Loading state works
- Error state works
- Sorting works
- Search works
- Results render correctly
- Empty state works
- Mobile layout works
- Desktop layout works
- No console errors

### Final Verification

**Goal:**  
Confirm MVP v2 is complete and ready for future real API planning.

**Input:**  
Completed MVP v2 implementation.

**Action:**  
Run automated tests, production build, and final manual acceptance review.

**Expected Result:**  
MVP v2 passes final review.

**Check:**  
Final status can be recorded as:

```text
RED TEST v2 = PASSED
Flight Search MVP v2 = COMPLETED
READY_FOR_REAL_API
```

**Size:**  
Small

---

## Not Included In MVP v2

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

## Self-Check

- [x] Tasks are small enough
- [x] Each task has a check
- [x] API-ready architecture is prepared
- [x] No real API is included
- [x] No backend is included
- [x] MVP scope is respected
- [x] No feature creep is introduced
- [x] Plan is ready for Controller review

---

## Send To Controller

Status: READY_FOR_REVIEW  
Version: v1

---

# 8. Handoff To Controller

Controller Agent receives:

- Producer Output v2;
- Analyst Output v2;
- MVP v2 workflow document.

Next expected output:

```text
Controller Output v2
```

---

# 9. Final Producer Status

```text
Producer Output v2 created.
Status: READY_FOR_REVIEW
Next Agent: Controller
```
