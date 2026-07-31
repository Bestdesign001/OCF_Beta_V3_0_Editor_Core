# MPS Content Factory (OCF Beta V3.0 Editor Core)

## Project rules

- MPS Content Factory is the only active project. Do not work on ProcurePilot, QDP, KEWPS13, or QueenRay Homepage from this directory. Do not create another application. Do not redesign the current approved Content Factory editor without explicit instruction.
- Read `AFFINE_SYNC/01_CURRENT_BUILD.md` before every build.
- Read `AFFINE_SYNC/03_APPROVED_DECISIONS.md` before modifying UI or workflow.
- Update all relevant `AFFINE_SYNC/` files after every completed build.
- Run tests before marking a build complete. (This project currently has no automated test command - see `AFFINE_SYNC/05_TEST_RESULTS.md`. Do not invent a test framework; use the project's real test command if/when one exists.)
- Run `scripts/run-after-build.ps1` after a successful build.
- Do not claim completion when tests fail.
- Do not create dead buttons or placeholder functions.
- Do not overwrite original photos.
- Do not modify unrelated modules.
- Every completed build must have a Git commit hash, recorded in `AFFINE_SYNC/04_CHANGELOG.md`.
- `AFFINE_SYNC/EXPORT/MPS_CONTENT_FACTORY_LATEST.md` is the single file prepared for AFFiNE import.

## Entry point

Open `OCF_START.html` directly in a browser - it is the current, self-contained application (see `AFFINE_SYNC/08_FILE_MAP.md` for why `index.html`/`js/*.js` is a separate, older copy).

## Persistence

Projects are saved to this browser's IndexedDB (`OCFArchiveDB` — `projects` + `photoBlobs` stores), not to a server. All calls go through the `ProjectStore` module (`saveProject`/`getProject`/`listProjects`/`deleteProject`/`savePhotoBlob`/`getPhotoBlob`) so a future server-backed store can replace it without touching editor code. Do not read/write IndexedDB directly from elsewhere in the editor — go through `ProjectStore`.
