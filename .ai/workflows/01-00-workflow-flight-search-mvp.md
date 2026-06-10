# 01-00 Workflow Package — Flight Search Frontend MVP

## Purpose

This file is the main workflow document for the Flight Search Frontend MVP project.

It describes:

- final agent chain;
- manual orchestration process;
- approved project scope;
- approved `.ai` documentation structure;
- approved implementation waves;
- current project status.

---

# Current Status

```text
CURRENT_STATUS: PASSED
NEXT_STEP: START_WAVE_1_IN_WINDSURF
```

The planning and review cycle is complete.

```text
Analyst   → PASSED
Producer  → PASSED
Controller → PASSED
```

---

# Agent Chain

```text
Analyst → Producer → Controller
```

Current orchestrator:

```text
User manually passes outputs between agents.
```

No automatic orchestration is used yet.

---

# Final Documentation Package

Use four main `.md` files:

```text
01-00-workflow-flight-search-mvp.md
01-01-analyst-agent-package.md
01-02-producer-agent-package.md
01-03-controller-agent-package.md
```

No ZIP package is required.

No single large `windsurf-implementation-spec.md` is required at this stage.

Reason:

- the workflow file defines orchestration;
- the analyst file explains priorities;
- the producer file contains the approved implementation plan;
- the controller file contains the final approval.

---

# Recommended Project Documentation Structure

```text
flight-search-mvp/

├── .ai/
│   ├── workflows/
│   │   └── 01-00-workflow-flight-search-mvp.md
│   │
│   ├── agents/
│   │   ├── 01-01-analyst-agent-package.md
│   │   ├── 01-02-producer-agent-package.md
│   │   └── 01-03-controller-agent-package.md
│   │
│   ├── memory/
│   │   ├── decisions.md
│   │   ├── constraints.md
│   │   └── glossary.md
│   │
│   └── context/
│       └── future-project-artifacts.md
│
├── src/
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

# Project

## Name

Flight Search Frontend MVP

## Goal

Create a frontend MVP for searching flights with one mandatory stop.

## Real Case

```text
Boston
  ↓
Istanbul
  ↓
Saint Petersburg
```

## Search Parameters

- From: Boston
- Via: Istanbul
- To: Saint Petersburg
- Mandatory stop: Istanbul
- Departure date range: 01 August 2026 – 10 August 2026
- Adults: 2, user configurable
- Min Layover: 3h
- Max Layover: 12h
- Currency: USD

## Stack

- Vite
- Vanilla JavaScript
- Tailwind CSS

## Interface And Communication Rules

- UI language: English
- Code comments: English
- Explanations to user: Russian
- IDE: Windsurf

---

# Workflow Run

## Step 1 — Analyst Agent

### Input

- Flight Search Frontend MVP document
- Real case: Boston → Istanbul → Saint Petersburg
- Required stop: Istanbul
- Departure date range: 01 August 2026 – 10 August 2026
- Adults: 2
- Min Layover: 3h
- Max Layover: 12h
- Currency: USD

### Output

```text
Status: READY_FOR_PLANNING
```

### Main Result

Analyst recommended focusing on:

1. Project Foundation
2. Search Form Data Model
3. Search Form UI
4. Validation Logic
5. Realistic Mock Results
6. Responsive UI & Polish

---

## Step 2 — Producer Agent v1

### Input

- Analyst Output v1
- MVP document

### Output

```text
Status: READY_FOR_REVIEW
Version: v1
```

### Main Result

Producer created an initial implementation plan.

---

## Step 3 — Controller Agent v1

### Input

- Producer Output v1

### Output

```text
Status: NEEDS_REVISION
Required Action: revise the plan
```

### Controller Feedback

Controller found four issues:

1. `Build Search Form UI` was too broad.
2. Search/filter logic task was missing.
3. Project structure was too general.
4. Validation task was too broad.

---

## Step 4 — Producer Agent v2

### Input

- Producer Output v1
- Controller Output v1
- Status: NEEDS_REVISION

### Output

```text
Status: READY_FOR_REVIEW
Version: v2
```

### Fixes Applied

Producer v2 fixed all Controller remarks:

1. Split Search Form UI into smaller tasks.
2. Added `Create Search Matching Logic`.
3. Defined exact project file structure.
4. Split Validation into separate validation groups.

---

## Step 5 — Controller Agent v2

### Input

- Producer Output v2

### Output

```text
Status: PASSED
Required Action: can start implementation
```

### Final Result

The implementation plan is approved.

---

# Approved Application Structure

```text
src/main.js

src/components/
  searchForm.js
  resultsList.js
  resultCard.js

src/data/
  mockFlights.js

src/utils/
  validation.js
  searchFlights.js

src/styles/
  input.css
```

---

# Approved Implementation Waves

## Wave 1 — Project Setup

1. Create Vite Project
2. Configure Tailwind CSS
3. Create Project File Structure

Review before moving to Wave 2.

---

## Wave 2 — Search Form Structure

4. Define Search Form Data Model
5. Build Route Fields UI
6. Build Date and Adults Fields UI
7. Build Layover Fields UI
8. Add Submit Button and Form Grouping

Review before moving to Wave 3.

---

## Wave 3 — Validation Logic

9. Add Form State Logic
10. Add Required Fields Validation
11. Add Route Validation
12. Add Passenger and Date Validation
13. Add Layover Validation

Review before moving to Wave 4.

---

## Wave 4 — Mock Results And Search Logic

14. Create Realistic Mock Results
15. Create Search Matching Logic
16. Render Result Cards
17. Add Empty State

Review before moving to Wave 5.

---

## Wave 5 — Responsive UI And Cleanup

18. Add Responsive Layout
19. Final Cleanup

Final review after Wave 5.

---

# Not Included In MVP

Do not implement:

- real flight API
- backend
- authentication
- payment
- search history
- advanced filters
- user accounts
- favorite routes

---

# Memory Layer

## `.ai/memory/decisions.md`

Stores accepted decisions:

```text
Use Vite.
Use Vanilla JavaScript.
Use Tailwind CSS.
UI language is English.
Code comments are English.
Explanations are Russian.
Use realistic mock flight results.
```

## `.ai/memory/constraints.md`

Stores project constraints:

```text
MVP only.
Personal use.
One mandatory stop only.
Mandatory stop is Istanbul.
No backend.
No real flight API.
No authentication.
No payment.
No search history.
No advanced filters.
```

## `.ai/memory/glossary.md`

Stores shared terms:

```text
Analyst = decides what should be done next.
Producer = creates implementation plan.
Controller = reviews plan quality.
PASSED = approved for next step.
NEEDS_REVISION = return to Producer.
Wave = small implementation batch.
Mock results = realistic fake flight data.
```

---

# Rule For Windsurf

Read files in this order:

```text
1. .ai/workflows/01-00-workflow-flight-search-mvp.md
2. .ai/agents/01-01-analyst-agent-package.md
3. .ai/agents/01-02-producer-agent-package.md
4. .ai/agents/01-03-controller-agent-package.md
```

Then implement only the current wave.

Do not implement the whole project at once.

---

# First Windsurf Command

```text
Read the four approved markdown files.

Start with Wave 1 only:
1. Create Vite Project
2. Configure Tailwind CSS
3. Create approved project file structure

Do not implement UI yet.
Do not add mock data yet.
Do not add validation yet.
Do not go outside the approved MVP scope.
```

---

# Final Status

```text
DOCUMENTATION_STATUS: COMPLETE
AGENT_SYSTEM_STATUS: PASSED
IMPLEMENTATION_STATUS: READY_FOR_WAVE_1
```
