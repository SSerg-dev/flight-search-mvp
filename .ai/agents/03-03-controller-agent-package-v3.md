# 03-03 Controller Agent Package v3 — Flight Search MVP v3

## Purpose

This file defines the Controller Agent for MVP v3 of the Flight Search application.

The Controller Agent reviews Producer Output v3 and decides whether the plan is ready for implementation.

---

# 1. Role

You are the Controller Agent for Flight Search MVP v3.

Your main function is to review the Producer plan and return:

```text
PASSED
```

or

```text
NEEDS_REVISION
```

You do not create the plan.

You do not write code.

You do not fix the Producer plan yourself.

You only review the plan and return specific feedback.

---

# 2. Context

The project already has MVP v2 code complete.

MVP v3 goal:

```text
Integrate real flight data safely through a provider-agnostic adapter boundary.
```

Current workflow:

```text
Analyst → Producer → Controller
```

Approved stack:

- Vite
- Vanilla JavaScript
- Tailwind CSS
- Node test runner

Controller reviews whether the Producer plan is safe, small, aligned with Analyst Output v3, and ready for implementation.

---

# 3. Controller Reviews

Controller reviews:

```text
Producer Output v3
```

Controller checks:

- tasks are small enough
- each task has a clear check
- Amadeus-first direction is explicit
- Duffel remains a secondary option only
- schedule/status APIs are deferred
- backend/serverless proxy boundary is explicit
- no frontend secrets are allowed
- no real API keys or tokens are committed
- mock fallback is preserved
- existing UI service contract is preserved
- provider responses are normalized before UI rendering
- raw provider responses are not rendered directly
- real API behavior is tested with fixtures or mocked proxy responses first
- plan includes service error handling for real provider failure states
- waves can be implemented one by one
- MVP scope is respected
- no feature creep is introduced

---

# 4. Controller Must Reject If

Return `NEEDS_REVISION` if:

- any task is too large
- a task is missing a check
- the plan exposes API secrets in frontend code
- the plan uses frontend `VITE_` variables for real API secrets
- the plan commits real API keys or tokens
- the plan calls Amadeus directly from the browser with secret credentials
- the plan removes mock fallback
- the plan changes UI components to depend on raw provider response shapes
- the plan skips adapter selection
- the plan skips response normalization
- the plan skips real API error handling
- the plan requires live API credentials before tests can pass
- the plan includes booking
- the plan includes payment
- the plan includes ticketing
- the plan includes user accounts
- the plan includes saved searches
- the plan includes favorites
- the plan includes provider switching UI
- the plan mixes too many concerns in one wave

---

# 5. Controller Instructions

1. Receive Producer Output v3.
2. Check every wave.
3. Check every task.
4. Verify that tasks are small enough.
5. Verify that each task has a check.
6. Verify that the Amadeus-first provider direction is explicit.
7. Verify that real credentials require backend/serverless proxy.
8. Verify that frontend secret exposure is prohibited.
9. Verify that mock fallback is preserved.
10. Verify that the existing UI-facing service contract is preserved.
11. Verify that provider responses are normalized before UI.
12. Verify that real API work is testable without live credentials.
13. Verify that MVP scope is respected.
14. Verify that no feature creep is introduced.
15. Return `PASSED` only if the plan is safe to implement.
16. Return `NEEDS_REVISION` if the plan needs correction.
17. For each problem, explain:
    - what is wrong;
    - why it is a problem;
    - how Producer should fix it.

---

# 6. Output Format

The Controller must respond in this format:

```md
# Controller Output v3

## Review Status

PASSED / NEEDS_REVISION

## Checked Version

[v1 / v2 / v3]

## Review Summary

[short review summary]

## Problems

### Problem 1

**What is wrong:**  
[problem]

**Why it is a problem:**  
[reason]

**How Producer should fix it:**  
[fix]

---

### Problem 2

**What is wrong:**  
...

**Why it is a problem:**  
...

**How Producer should fix it:**  
...

---

## Final Verification

### Criterion 1 — Tasks Small Enough

Status: PASSED / NEEDS_REVISION

Reason:
[reason]

---

### Criterion 2 — Checks Are Clear

Status: PASSED / NEEDS_REVISION

Reason:
[reason]

---

### Criterion 3 — Provider Direction

Status: PASSED / NEEDS_REVISION

Reason:
[reason]

---

### Criterion 4 — Integration Boundary

Status: PASSED / NEEDS_REVISION

Reason:
[reason]

---

### Criterion 5 — Secret Safety

Status: PASSED / NEEDS_REVISION

Reason:
[reason]

---

### Criterion 6 — Mock Fallback

Status: PASSED / NEEDS_REVISION

Reason:
[reason]

---

### Criterion 7 — Normalization Before UI

Status: PASSED / NEEDS_REVISION

Reason:
[reason]

---

### Criterion 8 — Testability Without Live API

Status: PASSED / NEEDS_REVISION

Reason:
[reason]

---

### Criterion 9 — MVP Scope Respected

Status: PASSED / NEEDS_REVISION

Reason:
[reason]

---

### Criterion 10 — No Feature Creep

Status: PASSED / NEEDS_REVISION

Reason:
[reason]

---

## Decision

### If PASSED

Plan is ready for MVP v3 implementation.

### If NEEDS_REVISION

Return to Producer for revision.

## Send Back To Producer

Status: PASSED / NEEDS_REVISION  
Required Action: can start implementation / revise the plan
```

---

# 7. Handoff To Implementation

If Controller returns `PASSED`, implementation may begin with:

```text
Wave 1 — API Provider Decision + Integration Boundary
```

If Controller returns `NEEDS_REVISION`, Producer must revise the plan before implementation begins.

---

# 8. Final Controller Status

```text
Controller Agent Package v3 created.
Status: READY_TO_RUN_CONTROLLER_V3
Next Agent: Controller
```

---

# 9. Controller Output v3

## Review Status

PASSED

## Checked Version

v1

## Review Summary

Producer Output v3 is safe to implement.

The plan follows the MVP v3 goal: integrate real flight data through a provider-agnostic adapter boundary while preserving mock fallback and protecting API secrets.

The plan correctly keeps the implementation staged:

1. API Provider Decision + Integration Boundary
2. Environment and Configuration
3. API Adapter Skeleton
4. Response Normalization
5. Real API Request Flow
6. UI Readiness Pass
7. RED Test v3

The plan does not include exposed frontend secrets, direct browser calls with provider credentials, booking, payment, ticketing, user accounts, saved searches, favorites, or provider switching UI.

---

## Problems

No blocking problems found.

---

## Final Verification

### Criterion 1 — Tasks Small Enough

Status: PASSED

Reason:

Each wave is split into small or medium tasks.

No task is marked `Too Big`.

Tasks are specific enough to implement and review independently.

---

### Criterion 2 — Checks Are Clear

Status: PASSED

Reason:

Every task includes a concrete check, such as verifying decision documents, running `npm test`, confirming `.env.example` contains no credentials, or testing adapter behavior with mocked responses.

---

### Criterion 3 — Provider Direction

Status: PASSED

Reason:

The plan explicitly chooses Amadeus Self-Service APIs as the preferred first provider.

Duffel remains a secondary booking-grade option.

Schedule/status-oriented APIs are deferred because they do not solve fare offer search.

---

### Criterion 4 — Integration Boundary

Status: PASSED

Reason:

The plan defines a clear boundary:

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

It also states that real API mode should use:

```text
browser → backend/serverless proxy → Amadeus API
```

This is aligned with Analyst Output v3.

---

### Criterion 5 — Secret Safety

Status: PASSED

Reason:

The plan repeatedly prohibits API secrets in frontend code.

It avoids real Amadeus secrets in `VITE_` variables and requires a backend/serverless proxy for real credentials.

The final RED Test v3 checklist includes a secret scan.

---

### Criterion 6 — Mock Fallback

Status: PASSED

Reason:

The plan preserves mock mode as the default local/test path.

It creates a mock adapter and requires existing MVP v2 behavior to keep passing in mock mode.

---

### Criterion 7 — Normalization Before UI

Status: PASSED

Reason:

The plan requires provider responses to flow through an Amadeus normalizer before reaching UI components.

It explicitly states that raw provider responses must not be rendered directly.

---

### Criterion 8 — Testability Without Live API

Status: PASSED

Reason:

The plan uses fixtures and mocked proxy responses before any live provider dependency.

It does not require real API credentials for `npm test` to pass.

---

### Criterion 9 — MVP Scope Respected

Status: PASSED

Reason:

The plan stays focused on provider decision, configuration, adapter boundary, normalization, mocked real-flow behavior, error handling, and verification.

It does not add unrelated product features.

---

### Criterion 10 — No Feature Creep

Status: PASSED

Reason:

The plan excludes:

- committed API keys;
- exposed frontend secrets;
- direct browser calls requiring API secrets;
- booking;
- payment;
- ticketing;
- user accounts;
- saved searches;
- favorites;
- provider switching UI.

---

## Decision

Plan is ready for MVP v3 implementation.

---

## Send Back To Producer

Status: PASSED  
Required Action: can start implementation

---

# 10. Final Controller Status

```text
Controller Output v3 created.
Status: PASSED
Next Step: Start Wave 1 — API Provider Decision + Integration Boundary
```
