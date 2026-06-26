# Hermes Orchestration Workflow

## Purpose

This document defines how Hermes should fit into the Flight Search MVP workflow.

The project is used as a learning environment for AI orchestration. The goal is to keep the workflow explicit, reproducible, and easy to review.

## Current Working Setup

The current effective loop is:

```text
User
↓
Devin IDE
↓
Codex
↓
Local project
```

This loop should stay in place.

- The user uses Devin IDE as the working cockpit.
- Codex is the main coding agent.
- The user reviews files, diffs, UI behavior, and test output from the project workspace.
- Codex makes focused changes, writes tests, runs verification, and explains results.

## Target Orchestration Model

Hermes should sit above the existing workflow as the orchestration layer.

```text
User
↓
Hermes
↓
.ai role packages
├─ Analyst
├─ Producer
└─ Controller
↓
Executor selection
├─ Codex inside the current Devin IDE workflow
└─ Devin autonomous for large tasks only
↓
GitHub
↓
Codespaces verification
```

## System Roles

### User

The user owns the goal, approves scope, and makes final decisions.

The user should decide:

- what problem matters;
- whether a task is small or large;
- whether to proceed with implementation;
- whether the result is acceptable.

### Hermes

Hermes is the orchestrator.

Hermes should not be treated as the primary coding agent. Its job is to structure the work before and after implementation.

Hermes should produce:

- task brief;
- role prompts;
- risk notes;
- executor recommendation;
- reviewer checklist;
- final summary.

### Analyst

The Analyst role investigates the task and current context.

Expected output:

```text
Goal
Context
Relevant files
Risks
Constraints
Recommended next step
```

### Producer

The Producer role turns the Analyst output into an implementation plan.

Expected output:

```text
Files to change
Steps
Tests
Verification commands
Done criteria
```

### Controller

The Controller role reviews the plan or result.

Expected output:

```text
PASSED / NEEDS_REVISION
Blocking issues
Missing tests
Scope risks
Final recommendation
```

### Codex

Codex is the primary coding agent for this project.

Use Codex for:

- everyday feature work;
- bug fixes;
- UI changes;
- service and adapter changes;
- test writing;
- debugging;
- documentation updates;
- verification with `npm test` and `npm run build`.

### Devin IDE

Devin IDE is the user's cockpit.

Use it to:

- inspect files;
- watch diffs;
- run or observe the app;
- coordinate commands to Codex;
- review the final result.

### Devin Autonomous

Use Devin autonomous only for larger tasks that can be delegated as a separate implementation unit.

Examples:

- broad refactor;
- new subsystem;
- large provider integration;
- full PR preparation.

Do not use Devin autonomous for every small change.

### GitHub

GitHub is the source of truth.

GitHub should store:

- source code;
- tests;
- `.ai` orchestration artifacts;
- `docs/superpowers` specs and plans;
- orchestration docs;
- commits, branches, and PR history.

GitHub must not store:

- `.env.local`;
- API keys;
- API secrets;
- bearer tokens;
- provider credentials.

### Codespaces

Codespaces is the clean verification workspace.

Use Codespaces to answer:

```text
Does this project run outside the local machine?
```

Minimum verification commands:

```bash
npm install
npm test
npm run build
npm run dev
```

Codespaces should not replace the current Devin IDE + Codex workflow. It should verify reproducibility.

## Standard Task Flow

```text
1. User describes the task.
2. Hermes creates a task brief.
3. Analyst reviews context and risks.
4. Producer creates the implementation plan.
5. Controller reviews the plan.
6. Hermes chooses the executor.
7. Codex or Devin implements.
8. Tests and build are run.
9. Changes are committed to GitHub.
10. Codespaces verifies clean-environment behavior when needed.
11. Hermes creates the final orchestration summary.
```

## Executor Selection

Use Codex when:

- task scope is small or medium;
- files are already known;
- tests can be written in the current repo;
- the user wants tight interactive control.

Use Devin autonomous when:

- task is large;
- task can be isolated into a branch or PR;
- implementation may take many steps;
- Codex would need repeated long-running coordination.

Use Codespaces when:

- the task needs clean-environment verification;
- local setup may hide missing configuration;
- the project should be demonstrated as reproducible from GitHub.

## Provider Documentation Note

The current active code supports these API modes:

```text
mock
serpapi
```

Current operational meaning:

- `mock`: default local and test mode.
- `serpapi`: current primary MVP live-search path, with known rate-limit risk.

Duffel and Amadeus remain only as historical research context in `.ai` documents. They are not active runtime providers.

Before future provider work, README, `.env.example`, and `.ai/memory/decisions.md` should remain aligned so there is one source of truth for provider status.

## No Copilot Requirement

GitHub Copilot is not required for this orchestration workflow.

Reason:

- Codex already acts as the coding agent.
- Devin IDE already acts as the user cockpit.
- Hermes should orchestrate roles, not compete with IDE autocomplete.
- Removing Copilot keeps responsibility clear.

## Recommended Next Infrastructure Step

The project has a Codespaces/devcontainer setup:

```text
.devcontainer/
└─ devcontainer.json
```

The devcontainer uses a Node.js 22 image, runs `npm install` after creation, and forwards Vite port `5173`.

Codespaces startup steps:

```text
1. Open the GitHub repository.
2. Choose Code -> Codespaces -> Create codespace on master.
3. Wait for the post-create `npm install` command to finish.
4. Run `npm test`.
5. Run `npm run build`.
6. Run `npm run dev -- --host 0.0.0.0`.
7. Open the forwarded Vite port.
```

Verification commands:

```bash
npm test
npm run build
npm run dev -- --host 0.0.0.0
```

This makes Codespaces a reliable clean verification environment for Hermes-led orchestration.
