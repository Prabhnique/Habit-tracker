# GitHub Issue Drafts

Use these drafts to create the parent PRD issue first, then create the implementation issues in the order shown so the dependency references line up cleanly.

## Issue 1: Parent PRD

**Title**  
PRD: Habit Tracker App proof of concept

**Body**

```md
## Problem Statement

The user needs a very simple habit tracker proof of concept that runs entirely in the browser with no backend, no account system, and no setup complexity. The app should let a single local user quickly add habits, view them in a list, mark them complete for the current day, delete them safely, and keep their data after refreshing the page.

The product goal is to validate the smallest useful daily habit-tracking loop without introducing extra features such as editing, history, streaks, reminders, syncing, or analytics. The experience should feel lightweight, fast, and understandable on first use in modern desktop and mobile browsers.

## Solution

Build a single-page browser app using HTML, CSS, and JavaScript with `localStorage` for persistence. The app will present one input for adding habits and one list showing all saved habits in the order they were created.

Each habit stores only an `id`, a `name`, and a `completedToday` boolean. Users can add a habit by pressing Enter or using the add button, mark a habit complete or incomplete for the current day using a checkbox, and remove a habit after confirming deletion. The app persists all state locally and automatically resets all habits to incomplete when the user's local calendar date changes.

The UI will be intentionally minimal: a single page, a friendly empty state when there are no habits, inline validation errors for invalid names, and a simple non-blocking message if persisted data cannot be loaded or saved.

## User Stories

1. As a single local user, I want to open the app in my browser without logging in, so that I can start tracking habits immediately.
2. As a single local user, I want the app to run entirely in the browser, so that I do not need a backend or internet-connected account.
3. As a user, I want to see a simple single-page interface, so that the proof of concept feels easy to understand and use.
4. As a user, I want to add a new habit by typing its name, so that I can track a routine that matters to me.
5. As a user, I want to press Enter to add a habit, so that creating habits feels quick and keyboard-friendly.
6. As a user, I want an add button to create a habit, so that the app is also easy to use with touch or pointer input.
7. As a user, I want the habit input to clear after a successful add, so that I can quickly enter another habit.
8. As a user, I want focus to remain on the input after adding a habit, so that repeated entry is fast.
9. As a user, I want habit names to be trimmed automatically, so that accidental spaces do not create messy data.
10. As a user, I want empty habit names to be rejected, so that my list stays meaningful.
11. As a user, I want duplicate habit names to be rejected case-insensitively, so that I do not accidentally track the same habit twice.
12. As a user, I want to see a simple inline validation error when a habit name is invalid, so that I understand how to fix the problem.
13. As a user, I want to see all of my habits in one list, so that I can review what I am tracking at a glance.
14. As a user, I want habits displayed in the order I added them, so that the list stays stable and predictable.
15. As a user, I want each habit row to show a checkbox, so that I can quickly mark whether I completed that habit today.
16. As a user, I want each habit to support a simple yes/no completion state, so that tracking remains lightweight.
17. As a user, I want to be able to check a habit as complete for today, so that I can record my daily progress.
18. As a user, I want to be able to uncheck a habit for today, so that I can correct mistakes easily.
19. As a user, I want checkbox state to be the only completion indicator, so that the interface stays visually minimal.
20. As a user, I want each habit to reset to incomplete when a new local calendar day starts, so that the app always represents today's progress.
21. As a user, I want the daily reset to happen automatically when I open or use the app on a new day, so that I do not need to manually clear yesterday's state.
22. As a user, I want my habit list to persist after refreshing the page, so that I do not lose my setup during normal use.
23. As a user, I want my completion state for the current day to persist across refreshes, so that the app remembers what I have already checked today.
24. As a user, I want to delete a habit I no longer want, so that my list stays relevant.
25. As a user, I want a confirmation dialog before deletion, so that I do not accidentally remove a habit with a stray click or tap.
26. As a first-time user, I want to see a friendly empty state when no habits exist, so that the app feels intentional rather than broken.
27. As a user, I want the empty state message to guide me to add my first habit, so that the first action is obvious.
28. As a user, I want the app to load saved state from a single browser storage entry, so that persistence remains simple and predictable.
29. As a user, I want the app to recover gracefully if saved data is corrupted, so that a bad storage value does not make the app unusable.
30. As a user, I want the app to fall back to an empty list if browser storage cannot be read, so that I can still use the app.
31. As a user, I want a simple non-blocking message if storage is unavailable or saving fails, so that I know something went wrong without losing access to the interface.
32. As a mobile user, I want the interface to work on a modern phone browser, so that I can use the proof of concept on smaller screens.
33. As a desktop user, I want the interface to work on a modern desktop browser, so that I can use the proof of concept comfortably on my computer.
34. As a developer evaluating the proof of concept, I want the app limited to a very small set of files and concerns, so that implementation stays fast and understandable.
35. As a developer evaluating the proof of concept, I want out-of-scope features excluded from the first version, so that the build remains focused on validating the core daily loop.

## Implementation Decisions

- The app will be a single-page browser application built only with HTML, CSS, and JavaScript.
- The implementation target is a minimal three-file structure: one HTML file, one stylesheet, and one JavaScript file.
- The app will support a single local user only.
- There will be no authentication, user accounts, backend, API, or data sync.
- Persistence will use a single `localStorage` key that contains the app state, including the saved habits and the last-seen local date used for daily reset.
- Each habit record will contain only three fields: `id`, `name`, and `completedToday`.
- Habit completion is a simple boolean for the current day only; there is no historical completion log.
- The app will compare the stored last-seen date with the browser's current local date and reset all `completedToday` values to `false` when the date changes.
- Habit names are required input, trimmed before validation and storage, and compared case-insensitively for uniqueness.
- The UI will reject empty or duplicate names and surface a simple inline validation error near the input.
- Habits will be displayed in insertion order with no sorting, grouping, or filtering.
- The primary add flow will support both clicking a button and pressing Enter.
- After a successful add, the input will be cleared and focus will remain in the input field.
- Each habit row will expose a standard checkbox for completion and a delete action.
- Checkbox state will be the only visual indicator of completion; no strikethrough, muted text, or alternate completed styling will be applied.
- Deletion will require an explicit confirmation dialog before state is updated.
- The empty state will display the message: "No habits yet. Add your first habit to get started."
- If stored JSON is unreadable or storage access fails, the app will fall back to an empty in-memory state and surface a simple non-blocking error message.
- The responsive requirement is basic support for modern desktop and mobile browsers only; legacy browser compatibility is not required.
- The internal design should favor small, clear modules such as state management, storage handling, daily reset logic, validation, and DOM rendering, with the logic separated enough to be testable if tests are later added.

## Testing Decisions

- Good tests should validate external behavior and user-observable outcomes rather than internal implementation details.
- The most important behaviors to test are habit creation, name validation, duplicate prevention, deletion confirmation flow, checkbox toggling, persistence, daily reset behavior, and graceful fallback when stored state is unreadable or unavailable.
- The most testable logic can be organized around deep modules that encapsulate state transitions and persistence rules behind simple interfaces.
- Modules that should be tested first are the storage/state module, the daily reset logic, and the habit validation logic, because they contain the most business rules and are easiest to verify in isolation.
- UI behavior can be covered with lightweight browser-oriented tests or manual acceptance testing focused on the add flow, inline errors, empty state, checkbox toggling, deletion, and refresh persistence.
- Since the current repository does not contain an existing test suite or prior art, testing patterns will need to be introduced from scratch if automated tests are added later.
- For this proof of concept, manual testing is acceptable if it directly verifies the acceptance criteria in modern desktop and mobile browsers.

## Out of Scope

- Editing existing habits
- Categories, tags, or habit grouping
- Streak tracking
- History tracking or completion archives
- Multiple completions per day
- Reminders or notifications
- Authentication or user accounts
- Syncing across devices or browsers
- Backend services, APIs, or databases
- Analytics, dashboards, or reporting
- Sorting, filtering, or search
- Visual completion styling beyond the checkbox state
- Legacy browser support

## Further Notes

- This PRD describes a proof of concept intended to validate the smallest viable daily tracking experience, not a production-ready habit platform.
- The acceptance criteria for completion are:
- A user can add a unique habit with Enter or a button.
- A user can see all habits in insertion order.
- A user can check or uncheck a habit for today.
- A user can delete a habit after confirming.
- Data persists across refreshes using browser storage.
- All habits reset to incomplete on a new local calendar day.
- Invalid or duplicate names show an inline error.
- Corrupted or unavailable storage falls back gracefully.
- If the project later expands, likely next-step decisions would include whether to add editing, history, better completion modeling, or a more durable storage strategy. Those expansions are intentionally excluded from this version.
```

## Issue 2: Single-page shell and empty state

**Title**  
Create the single-page shell and empty-state experience

**Body**

```md
## Parent PRD

#<replace-with-parent-prd-issue-number>

## What to build

Create the initial end-to-end browser experience for the habit tracker proof of concept. Build the single-page app shell with a minimal responsive layout, an input area for adding habits, a list container for habits, and the empty-state message shown when no habits exist.

This slice should make the app feel real on first load, even before persistence and interactions are completed. Align behavior and presentation with the parent PRD's Problem Statement, Solution, and Implementation Decisions sections.

## Acceptance criteria

- [ ] The app renders as a single-page interface in modern desktop and mobile browsers.
- [ ] The page includes the core structural elements needed for the add form and habit list.
- [ ] When there are no habits, the UI shows the message: "No habits yet. Add your first habit to get started."
- [ ] The layout is basically responsive and usable on both desktop and mobile screen sizes.

## Blocked by

None - can start immediately

## User stories addressed

- User story 1
- User story 2
- User story 3
- User story 13
- User story 26
- User story 27
- User story 32
- User story 33
- User story 34
```

## Issue 3: Local state and daily reset

**Title**  
Add local state bootstrapping and daily reset behavior

**Body**

```md
## Parent PRD

#<replace-with-parent-prd-issue-number>

## What to build

Implement browser-local state bootstrapping for the habit tracker using a single `localStorage` key. The app should safely load saved habits and the last-seen local date, persist state changes, automatically reset all habits to incomplete when the local calendar day changes, and recover gracefully if stored data is unreadable or storage is unavailable.

This slice should establish the full persistence and reset behavior described in the parent PRD without yet requiring all habit creation and interaction flows to be complete.

## Acceptance criteria

- [ ] App state is loaded from a single `localStorage` key that includes habits and last-seen date information.
- [ ] If the stored date differs from the current local date, all habits reset to `completedToday = false`.
- [ ] If stored data is corrupted or cannot be read, the app falls back to an empty habit list.
- [ ] If storage access fails, the app shows a simple non-blocking message instead of breaking.

## Blocked by

- Blocked by #<replace-with-issue-2-number>

## User stories addressed

- User story 20
- User story 21
- User story 22
- User story 23
- User story 28
- User story 29
- User story 30
- User story 31
```

## Issue 4: Habit creation and validation

**Title**  
Implement habit creation with validation and keyboard flow

**Body**

```md
## Parent PRD

#<replace-with-parent-prd-issue-number>

## What to build

Implement the end-to-end habit creation flow. Users should be able to add a habit with either the add button or Enter, while the app trims input, rejects empty names, prevents case-insensitive duplicates, shows inline validation errors, clears the input after a successful add, and keeps focus in the input for rapid repeated entry.

This slice should connect the UI, validation rules, and persistent state so habit creation works as a complete user-facing path.

## Acceptance criteria

- [ ] Users can add a habit by pressing Enter or clicking the add button.
- [ ] Habit names are trimmed before validation and storage.
- [ ] Empty names and case-insensitive duplicates are rejected with a simple inline error.
- [ ] After a successful add, the input clears and focus remains in the input field.

## Blocked by

- Blocked by #<replace-with-issue-2-number>
- Blocked by #<replace-with-issue-3-number>

## User stories addressed

- User story 4
- User story 5
- User story 6
- User story 7
- User story 8
- User story 9
- User story 10
- User story 11
- User story 12
```

## Issue 5: Completion and deletion interactions

**Title**  
Implement habit list interactions for completion and deletion

**Body**

```md
## Parent PRD

#<replace-with-parent-prd-issue-number>

## What to build

Implement the interactive behavior of saved habit rows. Each habit should render in insertion order with a standard checkbox that toggles `completedToday` for the current day and a delete action that requires confirmation before removal.

This slice should make the rendered habit list fully interactive and persistent, covering the main daily-use behaviors described in the parent PRD.

## Acceptance criteria

- [ ] Saved habits render in the order they were added.
- [ ] Each habit row includes a standard checkbox that can check or uncheck completion for today.
- [ ] Checkbox state is persisted and remains the only visual completion indicator.
- [ ] Deleting a habit requires confirmation before removal and updates saved state correctly.

## Blocked by

- Blocked by #<replace-with-issue-3-number>
- Blocked by #<replace-with-issue-4-number>

## User stories addressed

- User story 14
- User story 15
- User story 16
- User story 17
- User story 18
- User story 19
- User story 24
- User story 25
```

## Issue 6: Acceptance validation

**Title**  
Validate the proof of concept against acceptance criteria

**Body**

```md
## Parent PRD

#<replace-with-parent-prd-issue-number>

## What to build

Validate that the full habit tracker proof of concept meets the parent PRD's acceptance criteria in real browser usage. This includes checking add behavior, validation, persistence across refresh, daily reset, deletion confirmation, graceful storage fallback, and basic responsiveness on modern desktop and mobile browsers.

This slice is complete when the product is demoable end-to-end and the agreed proof-of-concept requirements are explicitly verified.

## Acceptance criteria

- [ ] The full set of PRD acceptance criteria has been manually verified end-to-end.
- [ ] Refresh persistence, daily reset behavior, and storage-failure fallback have been explicitly tested.
- [ ] The interface has been checked for basic usability in modern desktop and mobile browser layouts.
- [ ] Any defects found during validation are documented or resolved before closing the issue.

## Blocked by

- Blocked by #<replace-with-issue-5-number>

## User stories addressed

- User story 22
- User story 23
- User story 29
- User story 30
- User story 31
- User story 32
- User story 33
- User story 35
```
