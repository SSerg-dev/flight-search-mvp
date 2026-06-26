# Hermes Task Brief Template

Use this template to start a new Hermes-led task.

The goal is to make every task explicit before implementation starts: what problem is being solved, which role should think about it, who should execute it, and how the result will be verified.

## Task

```text
Task name:

Problem:

Desired outcome:

Why this matters now:
```

## Context

```text
Project area:

Relevant files:

Relevant docs:

Current behavior:

Expected behavior:
```

## Constraints

```text
Must keep:

Must not change:

Security constraints:

Provider/API constraints:

UI/UX constraints:

Testing constraints:
```

## Hermes Role Prompts

### Analyst Prompt

```text
You are the Analyst.

Review the task, current project context, constraints, and relevant files.

Return:
- goal summary
- affected areas
- risks
- missing information
- recommended next step

Do not write code.
Do not create the implementation plan.
```

### Producer Prompt

```text
You are the Producer.

Use the Analyst output to create a small implementation plan.

Return:
- files to create or modify
- ordered steps
- tests to add or update
- verification commands
- done criteria

Do not implement code.
Keep scope focused.
```

### Controller Prompt

```text
You are the Controller.

Review the Producer plan or final implementation.

Return:
- PASSED or NEEDS_REVISION
- blocking issues
- missing tests
- scope risks
- final recommendation

Do not fix the plan yourself.
Do not write code.
```

## Executor Selection

Choose one:

```text
Executor:
[ ] Codex
[ ] Devin autonomous
[ ] Codespaces verification only
```

Use Codex when:

- the task is small or medium;
- the files are already known;
- tight interactive control is useful;
- tests can be run in this repository.

Use Devin autonomous when:

- the task is large;
- the task can be isolated into a branch or PR;
- implementation may take many steps;
- autonomous exploration is useful.

Use Codespaces verification when:

- the change is already implemented;
- the goal is clean-environment verification;
- local setup may hide missing configuration.

## Implementation Request

```text
Executor:

Implementation scope:

Files allowed:

Files not allowed:

Required tests:

Required commands:

Expected final report:
```

## Verification Checklist

```text
[ ] Relevant tests pass
[ ] Full test suite passes when needed
[ ] Production build passes when needed
[ ] UI/browser check completed when needed
[ ] No provider secrets committed
[ ] .env.local not committed
[ ] README/docs updated when behavior changes
[ ] Git diff matches the task scope
[ ] Final result explained clearly
```

Default commands:

```bash
npm test
npm run build
```

Codespaces commands:

```bash
npm test
npm run build
npm run dev -- --host 0.0.0.0
```

## Done Criteria

```text
Done when:

Evidence:

Remaining risks:

Follow-up task:
```

## Final Hermes Summary

```text
Task:
Executor:
Files changed:
Tests run:
Build status:
Review status:
What changed:
What did not change:
Next recommended step:
```
