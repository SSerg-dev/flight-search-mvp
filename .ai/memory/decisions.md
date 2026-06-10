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
- MVP v3 provider direction: Amadeus Self-Service APIs first.
- MVP v3 secondary provider: Duffel API.
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
IMPLEMENTATION_STATUS: MVP_V3_WAVE_6_AUTOMATED_CHECKS_COMPLETE
```
