# Current Build

| Field | Value |
|---|---|
| Build ID | BUILD-2026.07.30-hero-position-diag |
| Objective | Diagnose and fix the root cause of hero-photo mispositioning on multi-page `buildAIDraft()`-generated projects |
| Scope | `buildAIDraft()`, `renderComposition()`, `applySlotPhoto()`/`loadHero()`/`fitHeroToFrame()`, `serializeActivePage()` in `OCF_START.html` |
| Acceptance criteria | 1. Root cause identified via live-browser diagnosis. 2. Smallest safe fix implemented. 3. Verified: hero geometry/identity correct on pages 1-3, multi-page navigation, save/reopen, and PNG export (incl. support slots). 4. `[diag]` logging removed once proven. All met. |
| Files expected to change | `OCF_START.html` only — `js/app.js`/`index.html` do not have the `buildAIDraft()`/multi-page Pages feature, so BUG-001 does not reproduce there (confirmed by inspection; out of scope, not touched) |
| Build status | **COMPLETE** |
| Start date | 2026-07-29 |
| Completion date | 2026-07-30 |
