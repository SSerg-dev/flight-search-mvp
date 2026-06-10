# constraints.md — Flight Search Frontend MVP

## Purpose

This file stores project constraints.

These constraints define what must not be changed or added during MVP implementation.

---

# Product Constraints

- MVP only.
- Personal use.
- One mandatory stop only.
- Mandatory stop is Istanbul.
- Route for the real case:
  - Boston
  - Istanbul
  - Saint Petersburg
- Adults field must be configurable.
- Default adults value for the test case: 2.
- Default minimum layover: 3h.
- Default maximum layover: 12h.
- Currency: USD.

---

# Technical Constraints

- MVP v1 and MVP v2 are frontend-only.
- MVP v3 may define a backend/serverless proxy boundary for real API credentials.
- Do not expose real API secrets in frontend code.
- Do not commit API keys, API secrets, bearer tokens, or access tokens.
- Do not put real provider secrets in `VITE_` environment variables.
- Keep mock mode available for local development and tests.
- No authentication.
- No payment.
- No search history.
- No advanced filters.
- No user accounts.
- No favorite routes.

---

# Implementation Constraints

- Do not implement everything at once.
- Implement one wave at a time.
- Review after every wave.
- Do not go outside the approved MVP scope.
- Use only:
  - Vite
  - Vanilla JavaScript
  - Tailwind CSS
