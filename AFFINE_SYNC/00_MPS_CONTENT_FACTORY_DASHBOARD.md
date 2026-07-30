# MPS Content Factory — Dashboard

| Field | Value |
|---|---|
| Product name | MPS Content Factory (codebase: OCF Beta V3.0 Editor Core) |
| Current version | Beta V3.0 |
| Current build | 3decadb — Fix BUG-001: hero photo mispositioned/misidentified across buildAIDraft() pages |
| Overall status | IN DEVELOPMENT — BUG-001 resolved, Build AI Draft workflow clear of known bugs |
| Current workflow stage | Phase 2.3 (BUG-001 fixed and verified) |

## Modules completed
- Dashboard / Factory selection (7 factories defined in `FactoryManager`)
- Workspace shell + workflow menu navigation
- Photo Upload (file picker + drag/drop)
- Photo Queue (reorder-free list, rename, delete)
- Choose Hero (manual selection via `setHero`)
- Layers panel (visibility/lock toggles, rename, z-order)
- Object Transform (move/resize/rotate handles, X/Y/W/H/rotation/opacity fields)
- Align / Arrange
- Text layers (title/subtitle editing, paste-to-detect title/subtitle)
- Multi-page Pages panel (add/duplicate/delete/switch page)
- Hero Analysis (display-only AI scoring — sharpness, face detection where available; never auto-assigns)
- Build AI Draft / multi-page Auto Layout generation (correct hero geometry and identity on every page as of this build)
- Export PNG for Hero, Title, Subtitle, gradient overlay, and Support slots 1–4

## Modules in progress
- Export PNG text-layer positioning — `renderComposition()` intentionally does not yet apply the Composition Model's frame to title/subtitle (see code comment at OCF_START.html renderComposition, `applyTextContent`); deferred to a future dynamic-rendering phase.

## Modules blocked
- None identified in current source.

## Latest Git commit
`3decadb5ddd5f0929bb80479b808aafadc8d78e1` (local branch `master`, no remote configured)

## Latest test result
No automated test suite exists in this project (no `package.json`, no test files found). Verification is live in-browser testing (Chrome automation against a local HTTP server). See `05_TEST_RESULTS.md` — all BUG-001 regression checks PASS.

## Current unresolved bugs
None open. BUG-001 (hero photo mispositioned/misidentified during `buildAIDraft()` multi-page generation) fixed and verified — see `06_BUG_TRACKER.md`.

## Exact next build
See `07_NEXT_BUILD.md`.
