# Hermes Task 001: Light And Dark Theme Toggle

## Task

```text
Task name:
Add light and dark theme support with a UI toggle.

Problem:
The app currently has a fixed light visual style. Users cannot switch between light and dark themes, which makes the interface less comfortable across different lighting conditions.

Desired outcome:
The Flight Search MVP supports both light and dark themes. A visible theme toggle lets the user switch modes, and the selected mode persists across page reloads.

Why this matters now:
The app is becoming a real working interface, not only a search experiment. Theme support is a good first Hermes-led task because it touches UI, state, styling, accessibility, and verification without changing flight search logic.
```

## Context

```text
Project area:
Frontend UI and styling.

Relevant files:
- src/main.js
- src/styles/input.css
- src/components/searchForm.js
- src/components/searchResults.js
- src/components/resultsList.js
- src/components/roundTripResultsList.js
- src/components/resultCard.js
- src/components/searchStatus.js

Relevant docs:
- docs/orchestration/hermes-workflow.md
- docs/orchestration/task-brief-template.md
- docs/superpowers/specs/2026-06-15-round-trip-search-design.md

Current behavior:
The app renders with light Tailwind utility classes such as bg-slate-50, bg-white, text-slate-900, and border-slate-200. There is no theme state and no theme toggle.

Expected behavior:
The app renders correctly in light and dark themes. The user can switch themes from the main UI. The selected theme remains active after reload.
```

## Constraints

```text
Must keep:
- Existing flight search behavior.
- Existing one-way and round-trip behavior.
- Existing SerpApi-only provider direction.
- Current Vanilla JS + Vite + Tailwind architecture.
- Current tests passing.

Must not change:
- Flight API contract.
- Provider configuration.
- Mock flight data shape.
- Search query validation rules unless required by a theme-specific bug.

Security constraints:
- Do not add secrets.
- Do not expose provider keys in frontend code.
- Do not change .env handling.

Provider/API constraints:
- No provider work in this task.
- No real API calls are required for theme verification.

UI/UX constraints:
- Theme toggle should be visible near the top of the app.
- Toggle should be understandable without explanatory text blocks.
- Light mode should remain clean and close to the current design.
- Dark mode should have clear contrast for forms, result cards, validation errors, status messages, and price text.
- Avoid layout shifts when toggling.
- Respect accessible labels for the toggle.

Testing constraints:
- Add or update tests only where current test structure supports it.
- At minimum run npm test and npm run build.
- Browser/UI verification is required because this is a visual feature.
```

## Hermes Role Prompts

### Analyst Prompt

```text
You are the Analyst.

Review the theme toggle task, current frontend structure, Tailwind usage, and component rendering flow.

Return:
- goal summary
- affected areas
- recommended theme state location
- accessibility risks
- visual risks
- test risks
- missing information
- recommended next step

Do not write code.
Do not create the implementation plan.
```

### Producer Prompt

```text
You are the Producer.

Use the Analyst output to create a focused implementation plan for light/dark theme support.

Return:
- files to create or modify
- ordered implementation steps
- recommended theme storage approach
- components that need class updates
- tests to add or update
- browser verification steps
- done criteria

Do not implement code.
Keep scope focused on theme support only.
```

### Controller Prompt

```text
You are the Controller.

Review the Producer plan or final implementation for the theme toggle task.

Return:
- PASSED or NEEDS_REVISION
- blocking issues
- missing tests
- accessibility concerns
- UI contrast concerns
- scope risks
- final recommendation

Do not fix the plan yourself.
Do not write code.
```

## Executor Selection

```text
Executor:
[x] Codex
[ ] Devin autonomous
[ ] Codespaces verification only
```

Use Codex for this task because it is a small-to-medium UI feature with known files, tight feedback needs, and local test/build verification.

Use Codespaces after implementation for clean-environment verification if needed.

## Implementation Request

```text
Executor:
Codex

Implementation scope:
Add light and dark theme support with a persistent UI toggle.

Files allowed:
- src/main.js
- src/styles/input.css
- src/components/*.js
- tests or docs if needed

Files not allowed:
- Provider implementation files unless a test import requires a narrow update
- .env files
- package-lock.json unless a dependency is intentionally added
- package.json unless a dependency or script is intentionally added

Required tests:
- Existing test suite must pass.
- Add focused tests if theme state helpers or rendering helpers are extracted.

Required commands:
npm test
npm run build

Expected final report:
- Files changed
- Theme behavior summary
- Persistence behavior
- Tests and build status
- Any visual verification notes
```

## Recommended Design Direction

```text
Theme modes:
- light
- dark

Default:
- Use saved theme from localStorage when present.
- Otherwise default to light for MVP.

Toggle placement:
- Top area of the app near the Flight Search heading.

Toggle behavior:
- Clicking the toggle updates app state.
- The root app container receives the current theme context.
- The selected theme is saved to localStorage.

Styling approach:
- Prefer explicit theme-aware Tailwind classes in existing components.
- Keep light theme visually close to the current app.
- Use dark slate surfaces with high contrast text and visible borders.

Accessibility:
- Toggle must be a button or switch with an accessible label.
- Current state should be available to assistive technology.
- Focus rings must remain visible in both themes.
```

## Verification Checklist

```text
[ ] Relevant tests pass
[ ] Full test suite passes when needed
[ ] Production build passes
[ ] UI/browser check completed in light mode
[ ] UI/browser check completed in dark mode
[ ] Theme persists after reload
[ ] Toggle is keyboard accessible
[ ] Forms, result cards, errors, and status messages remain readable
[ ] No provider secrets committed
[ ] .env.local not committed
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
The app supports light and dark themes, the toggle works, the choice persists after reload, and verification passes.

Evidence:
- npm test output
- npm run build output
- browser check notes or screenshots

Remaining risks:
Visual polish may need one follow-up pass after real browser inspection on desktop and mobile.

Follow-up task:
Consider adding system theme detection after MVP manual toggle is stable.
```

## Final Hermes Summary

```text
Task:
Add light and dark theme support with a persistent UI toggle.

Executor:
Codex

Files changed:
To be filled after implementation.

Tests run:
To be filled after implementation.

Build status:
To be filled after implementation.

Review status:
To be filled after Controller review.

What changed:
To be filled after implementation.

What did not change:
Flight search behavior, provider configuration, and API contracts should remain unchanged.

Next recommended step:
Run Analyst, Producer, and Controller prompts through Hermes, then approve implementation.
```
