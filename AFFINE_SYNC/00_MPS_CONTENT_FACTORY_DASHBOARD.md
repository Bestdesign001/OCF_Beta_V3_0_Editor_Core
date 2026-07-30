# MPS Content Factory — Dashboard

| Field | Value |
|---|---|
| Product name | MPS Content Factory (codebase: OCF Beta V3.0 Editor Core) |
| Current version | Beta V3.0 |
| Current build | 582428c — Checkpoint: support-slot export fix + hero-position diagnostic logging |
| Overall status | IN DEVELOPMENT — active bug investigation blocking Build AI Draft workflow |
| Current workflow stage | Phase 2.3 (post hero-clear fix, mid hero-position diagnosis) |

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
- Export PNG for Hero, Title, Subtitle, gradient overlay, and (as of this build) Support slots 1–4

## Modules in progress
- **Build AI Draft / Auto Layout multi-page generation** — hero photo renders in the wrong position on page 3 of a generated draft. Root cause not yet confirmed; `[diag]` console logging has been added around `renderComposition()` / `serializeActivePage()` in `buildAIDraft()` (OCF_START.html) but the logs have not yet been captured or analyzed. **No code changes are authorized until the logs are reviewed.**
- Export PNG text-layer positioning — `renderComposition()` intentionally does not yet apply the Composition Model's frame to title/subtitle (see code comment at OCF_START.html renderComposition, `applyTextContent`); deferred to a future dynamic-rendering phase.

## Modules blocked
- None identified in current source.

## Latest Git commit
`582428c4677334306111f1f4dd4231d64baa4117` (local branch `master`, no remote configured)

## Latest test result
No automated test suite exists in this project (no `package.json`, no test files found). Verification to date has been manual in-browser testing. See `05_TEST_RESULTS.md`.

## Current unresolved bugs
- BUG-001 — Hero photo mispositioned on page 3 during `buildAIDraft()` multi-page generation. See `06_BUG_TRACKER.md`.

## Exact next build
See `07_NEXT_BUILD.md` — analyze captured `[diag]` logs and fix the confirmed root cause of BUG-001.
