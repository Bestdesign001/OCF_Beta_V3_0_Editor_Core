# Current Build

| Field | Value |
|---|---|
| Build ID | BUILD-2026.07.30-hero-position-diag |
| Objective | Diagnose the root cause of hero-photo mispositioning on page 3 of a `buildAIDraft()`-generated multi-page project |
| Scope | `buildAIDraft()`, `renderComposition()`, `applySlotPhoto()`/`loadHero()`/`fitHeroToFrame()`, `serializeActivePage()` in `OCF_START.html` |
| Acceptance criteria | 1. `[diag]` console output captured from a repro run. 2. Root cause identified as exactly one of: (a) incorrect input to `renderComposition()`, (b) hero geometry not updated before `serializeActivePage()` runs, (c) `serializeActivePage()` capturing stale geometry, (d) geometry mutated after serialization. 3. No conclusion drawn or code changed until logs are analyzed. |
| Files expected to change | `OCF_START.html` (diagnostic logging already added, no fix applied yet); `js/app.js` only if the root cause also affects the legacy `index.html` code path |
| Build status | IN PROGRESS — blocked on diagnostic log capture (user has not yet reproduced/captured the `[diag]` output) |
| Start date | 2026-07-29 |
| Completion date | — (not complete) |
