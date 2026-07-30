# AFFiNE Sync Rules

MPS Content Factory uses AFFiNE (claude.ai/design's sibling tool, used here as the project control centre) to track product status without anyone manually creating pages or typing updates. Claude Code builds the software; the `AFFINE_SYNC/` folder is the single source of truth that gets imported into AFFiNE.

## What lives where

| Path | Purpose |
|---|---|
| `AFFINE_SYNC/00_MPS_CONTENT_FACTORY_DASHBOARD.md` | One-page status snapshot: version, build, workflow stage, module status, latest commit/test/bugs, next build |
| `AFFINE_SYNC/01_CURRENT_BUILD.md` | The build currently in progress: objective, scope, acceptance criteria, status, dates |
| `AFFINE_SYNC/02_PRODUCT_STATUS.md` | Per-module tracker (status, % complete, working/missing functions, known bugs, last commit) |
| `AFFINE_SYNC/03_APPROVED_DECISIONS.md` | Permanent product policy — do not contradict without explicit instruction |
| `AFFINE_SYNC/04_CHANGELOG.md` | One entry per completed build, newest first |
| `AFFINE_SYNC/05_TEST_RESULTS.md` | Manual/automated test results (this project currently has no automated test framework) |
| `AFFINE_SYNC/06_BUG_TRACKER.md` | Open and resolved bugs with reproduction steps and root cause |
| `AFFINE_SYNC/07_NEXT_BUILD.md` | Exactly one approved next build — not a backlog |
| `AFFINE_SYNC/08_FILE_MAP.md` | Where each architectural concern lives in the actual source tree |
| `AFFINE_SYNC/AFFINE_LATEST_UPDATE.md` | Regenerated after every completed build; combines only the latest useful info for direct AFFiNE import |
| `AFFINE_SYNC/EXPORT/MPS_CONTENT_FACTORY_LATEST.md` | Copy of the above — the exact file to import into AFFiNE |

`AFFINE_SYNC/` holds project-status records only. Application runtime code never lives here.

## Process

1. Before starting a build, read `AFFINE_SYNC/01_CURRENT_BUILD.md` (what's approved) and `AFFINE_SYNC/03_APPROVED_DECISIONS.md` (what must not be redesigned).
2. After completing a build:
   - Update `02_PRODUCT_STATUS.md`, `04_CHANGELOG.md`, `05_TEST_RESULTS.md`, `06_BUG_TRACKER.md`, `07_NEXT_BUILD.md` as applicable.
   - Regenerate `AFFINE_LATEST_UPDATE.md`.
   - Run `scripts/run-after-build.ps1`, which runs the project's real test command (there isn't one yet — see below), and on success runs `scripts/update-affine-sync.ps1` to stamp the latest Git commit info into `AFFINE_LATEST_UPDATE.md` and copy it to `AFFINE_SYNC/EXPORT/MPS_CONTENT_FACTORY_LATEST.md`.
3. Every completed build must have a Git commit hash recorded in `04_CHANGELOG.md` and `AFFINE_LATEST_UPDATE.md`.
4. Do not claim a build complete if tests fail, if it uses dead buttons/placeholder functions, or if it modifies a module not in scope.

## Test command

As of this build, MPS Content Factory has no `package.json` and no automated test framework — it is a static `OCF_START.html` opened directly in a browser. `scripts/run-after-build.ps1` does not invent a test framework; it reports that no automated test command exists and proceeds to the sync step. If/when a real test command is introduced, update `run-after-build.ps1` to call it instead of skipping.
