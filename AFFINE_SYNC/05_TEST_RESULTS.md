# Test Results

**Test capability note:** This project has no automated test framework (no `package.json`, no test runner, no test files anywhere in the repository as of this build). All results below are from live in-browser verification (Chrome, driven via browser automation against a local `python -m http.server` — `file://` cannot be automated by the extension used). Do not invent a test framework — `scripts/run-after-build.ps1` reflects this and skips automated testing until the user commissions one.

| Test name | Expected result | Actual result | Pass/Fail | Evidence | Remaining problem |
|---|---|---|---|---|---|
| Build AI Draft: page 1 (cover) hero geometry + identity | `project.pages[0].hero` matches the true cover-fit of `project.pages[0].heroPhotoId`'s photo against that page's template frame | Matched exactly | PASS | Live JS inspection: `actualHero` === `expectedHero` (computed independently from `calculateCoverFit`) | None |
| Build AI Draft: page 2 hero geometry + identity | Same, for page 2 (a different hero photo per `planPages()` chunking) | Matched exactly | PASS | Same method | None |
| Build AI Draft: page 3 hero geometry + identity | Same, for page 3 — this is the page originally reported as broken | Matched exactly | PASS | Same method | None |
| All pages have distinct `heroPhotoId` | Each page's hero photo differs (per `planPages()`'s non-overlapping chunking of overflow photos) | 3 pages, 3 distinct `heroPhotoId`s | PASS | `new Set(project.pages.map(p=>p.heroPhotoId)).size === 3` | None |
| Multi-page navigation (repeated forward/backward via `switchToPage`) | Live `hero` object, `heroImg.src`, and `heroIndex` stay consistent with the active page's saved data on every switch | 6/6 navigation steps (1,2,0,2,1,0) matched | PASS | Live JS inspection | None |
| Save/reopen (JSON round-trip of `project` + `loadPageState()` reload) | Reloading from serialized data reproduces the correct photo and finite geometry for every page | All 3 pages matched, no NaN/Infinity | PASS | Live JS inspection | None |
| Export PNG: hero + support slots (page 1, template-5) | Exported canvas shows the correct hero photo and all 4 correct support photos, no exceptions | Hero pixel sample = photo's true color; all 4 support-slot pixel samples matched their correct photos; 7 layers drawn, 0 exceptions | PASS | Pixel sampling via `getImageData` on an off-screen canvas built the same way `exportPNG()` does | None |
| Export PNG: real `exportPNG()` call on all 3 pages | No exceptions on any page | 0/3 threw | PASS | Live JS inspection | None |
| Console errors during full test run | No uncaught errors/exceptions | None found | PASS | `read_console_messages` (error filter) | None |
