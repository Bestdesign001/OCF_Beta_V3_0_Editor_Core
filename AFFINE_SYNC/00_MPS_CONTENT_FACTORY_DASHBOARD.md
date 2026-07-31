# MPS Content Factory — Dashboard

| Field | Value |
|---|---|
| Product name | MPS Content Factory (codebase: OCF Beta V3.0 Editor Core) |
| Current version | Beta V3.0 |
| Current build | 9b01e32 — Project Persistence / Archive: save/reopen a project across a real browser restart |
| Overall status | IN DEVELOPMENT — BUG-001 and BUG-002 resolved, automation pipeline complete, project persistence complete |
| Current workflow stage | Phase 2.4 (Project Persistence / Archive complete and verified) |

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
- Build AI Draft / multi-page Auto Layout generation, now content-section driven (Cover/Activity/Results/Public Information/Closing)
- Automatic event-text extraction (Date/Time/Location/Department/Activity/Result/Public Information/Closing) with labelled and unstructured-text support
- Automatic Facebook + TikTok caption generation
- Automatic photo distribution with "assigned or unused-with-reason" coverage for every uploaded photo
- Editorial review: every automatically generated field is editable afterward
- Export PNG (current page) and Export All Pages, for Hero, Title, Subtitle, gradient overlay, and Support slots 1–4

## Modules in progress
- Export PNG text-layer positioning — `renderComposition()` intentionally does not yet apply the Composition Model's frame to title/subtitle (see code comment at OCF_START.html renderComposition, `applyTextContent`); deferred to a future dynamic-rendering phase.
- Location/Department/Activity/etc. inference for fully unlabelled pasted text (only title/subtitle/date/time are inferred positionally/by pattern without explicit labels).

## Modules blocked
- None identified in current source.

## Latest Git commit
`57abfdc93de054cf9ad87690bd3b17c3fb6584c5` (local branch `master`, no remote configured)

## Latest test result
No automated test suite exists in this project (no `package.json`, no test files found). Verification is live in-browser testing (Chrome automation against a local HTTP server, real file uploads and real event text). See `05_TEST_RESULTS.md` — full BUG-002 acceptance flow and BUG-001 regression checks all PASS.

## Current unresolved bugs
None open. BUG-001 and BUG-002 fixed and verified — see `06_BUG_TRACKER.md`.

## Exact next build
See `07_NEXT_BUILD.md`.
