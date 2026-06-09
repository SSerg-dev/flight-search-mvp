# 05-00 Workflow Package — Flight Search MVP v2

## Purpose

This document defines the workflow for MVP v2 of the Flight Search application.

The goal of MVP v2 is to prepare the application for real-world flight data while continuing to use mock data.

MVP v2 does not include a real flight API.

The project continues to use:

- Analyst Agent
- Producer Agent
- Controller Agent

with manual orchestration.

---

# Current Status

```text
MVP v1: COMPLETED
MVP v2: PLANNING
NEXT_STEP: START_ANALYST_V2
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

# MVP v2 Goal

Prepare the application architecture for future real API integration.

Improve:

- data structure
- service architecture
- loading state
- error state
- filtering
- sorting
- UI and UX

without introducing external API dependencies.

---

# Approved Stack

- Vite
- Vanilla JavaScript
- Tailwind CSS

---

# Analyst v2 Input

Analyst receives:

- MVP v1 Results
- Current Application State
- MVP v2 Goal

---

# Analyst v2 Responsibilities

Analyze:

- architecture gaps
- API readiness
- technical debt
- UX improvements
- implementation priorities

Output:

```text
READY_FOR_PLANNING
```

Priority Recommendations:

1. Data Model Upgrade
2. Service Layer
3. Loading State
4. Error State
5. Sorting
6. UX Improvements

---

# MVP v2 Waves

## Wave 1 — Data Model Upgrade

Goal:

Make mock data resemble real-world API responses.

Tasks:

- redesign mock flight structure
- add airline object
- add price object
- add route object
- add segments array
- add duration object
- add availability object
- update result cards

---

## Wave 2 — Service Layer

Goal:

Separate UI from the data source.

Tasks:

- create src/services/flightService.js
- move search entry point into service layer
- return async results
- simulate API behavior

---

## Wave 3 — Loading State

Goal:

Prepare UI for asynchronous requests.

Tasks:

- add loading state
- add loading indicator
- add loading message
- simulate request delay

---

## Wave 4 — Error State

Goal:

Prepare UI for service failures.

Tasks:

- create error state
- display user-friendly error messages
- simulate service failures
- separate validation errors from service errors

---

## Wave 5 — Sorting

Goal:

Improve result usability.

Tasks:

- sort by price
- sort by duration
- add sorting dropdown

---

## Wave 6 — UI / UX Improvements

Goal:

Improve application usability.

Tasks:

- improve spacing
- improve visual hierarchy
- improve result cards
- improve loading UX
- improve empty state
- improve mobile experience

---

## Wave 7 — RED Test v2

Checklist:

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

Result:

```text
RED TEST v2 = PASSED

Flight Search MVP v2 = COMPLETED

READY_FOR_REAL_API
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
Real Flight API Integration
```
