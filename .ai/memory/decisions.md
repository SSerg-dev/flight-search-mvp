# decisions.md — Flight Search Frontend MVP

## Purpose

This file stores accepted project decisions.

These decisions should remain stable unless the user explicitly changes them.

---

# Accepted Decisions

- Use Vite.
- Use Vanilla JavaScript.
- Use Tailwind CSS.
- UI language is English.
- Code comments are English.
- Explanations to the user are Russian.
- Use realistic mock flight results.
- Work by small implementation waves.
- Use Windsurf as the implementation IDE.
- Keep the MVP frontend-only.
- Use manual agent orchestration for now.
- MVP v3 airport metadata source: OurAirports local dataset.
- MVP v3 current live flight offers source: SerpApi Google Flights via backend/serverless proxy.
- MVP v3 Duffel path remains historical provider research context only; active runtime code uses SerpApi and mock.
- MVP v3 Amadeus runtime path was removed after provider research; keep historical notes in `.ai` only.
- MVP v3 Amadeus Self-Service path is deprecated risk because the self-service portal is scheduled for decommissioning on 2026-07-17.
- MVP v3 real API credentials require a backend/serverless proxy.
- MVP v3 must keep mock fallback for local development and tests.

---

# Agent System Decisions

- Analyst decides what should be done next.
- Producer creates the implementation plan.
- Controller reviews the plan quality.
- Implementation starts only after Controller returns `PASSED`.

---

# Current Status

```text
DOCUMENTATION_STATUS: COMPLETE
AGENT_SYSTEM_STATUS: PASSED
IMPLEMENTATION_STATUS: MVP_V3_SERPAPI_PATH_CURRENT
```
