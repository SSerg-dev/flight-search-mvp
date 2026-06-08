# glossary.md — Flight Search Frontend MVP

## Purpose

This file stores shared terminology for the project and the agent workflow.

---

# Agent Terms

## Analyst

Decides what should be done next.

Input:

- idea
- phase
- backlog
- current state

Output:

- priorities
- quick wins
- defer list
- recommendations to Producer

---

## Producer

Creates the implementation plan.

Input:

- Analyst Output
- project specification
- constraints

Output:

- implementation tasks
- task checks
- plan version
- status `READY_FOR_REVIEW`

---

## Controller

Reviews plan quality.

Input:

- Producer Output

Output:

- `PASSED`

or

- `NEEDS_REVISION`
- problems
- required fixes

---

# Workflow Terms

## PASSED

Approved for the next step.

## NEEDS_REVISION

Return to Producer for correction.

## Wave

A small implementation batch.

Each wave must be implemented and reviewed before moving to the next wave.

## MVP

Minimum viable product.

The smallest useful version of the application.

## Mock Results

Realistic fake flight data used instead of a real flight API.

## Manual Orchestration

The user manually passes results between agents.

Current chain:

```text
Analyst → Producer → Controller
```
