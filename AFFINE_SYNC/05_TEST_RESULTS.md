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

## BUG-002 acceptance flow (locked automation pipeline)
Verified live with real uploaded photos (10 real PNG files via the actual `#photoInput` file input) and a real structured event-text paste. Note on method: real OS-level mouse clicks were unreliable in this session's browser-automation environment (tabs repeatedly opened without OS window focus, confirmed by attaching raw `mousedown`/`click` listeners to the page and observing zero events on click — a tooling limitation, not an app defect); button/element `.click()` and real `dispatchEvent(new Event(...))` calls were used instead, which exercise the actual `onclick`/`oninput` handlers and DOM, just without OS input routing. Genuine file uploads and JSON-round-trip save/reopen are unaffected by this.

| Step | Result | Evidence |
|---|---|---|
| Upload Photos | PASS | 10 real files via `file_upload` to `#photoInput`; `photos.length===10` |
| Photo Queue | PASS | All 10 rendered with correct names/order |
| Automatic hero selection | PASS | `recomputeHeroScores()` → `recommendedHeroId` set correctly |
| Automatic text extraction (Date/Time/Location/Department/Activity/Result/Public Information/Closing) | PASS | Real structured paste → `eventInfo` matched every field exactly |
| Automatic photo distribution | PASS | 10/10 photos assigned across pages, 0 unused; "unused with reason" path separately verified with a synthetic 30-photo overflow (14 correctly flagged, reason present) |
| Automatic multi-page generation (Cover/Activity/Results/Public Information/Closing) | PASS | 5 pages generated, section/type/title/subtitle correct on each |
| Automatic title/subtitle per page | PASS (was FAIL until fixed) | `serializeActivePage()` was reading the global title input, so every page showed the cover's title; fixed to read the rendered layer text |
| Automatic Facebook caption | PASS | Paragraph style, no emojis, only extracted fields |
| Automatic TikTok caption | PASS | Shorter + hashtags from extracted fields only (fixed a punctuation bug in hashtag sanitization) |
| Editorial review (edit anything afterward) | PASS | All new Event Details fields and both captions are live editable inputs/textareas |
| Multi-page navigation | PASS | 7/7 navigation steps across all 5 pages matched saved state |
| Save/Reopen (JSON round-trip) | PASS | All 5 pages reloaded with correct title, hero photo, and geometry |
| Export Current Page | PASS | No exceptions |
| Export All Pages | PASS (was MISSING until implemented) | 5 distinct filenames produced, original active page restored afterward |
| Delete Page | PASS | Verified via `window.confirm` override (real users see a normal native dialog; this only works around the automation tooling being unable to click a native dialog) |
| Hero/support photo geometry (BUG-001 regression check) | PASS | All page hero geometries finite; no-hero pages correctly show the harmless default (no photo to fit) |
| Console errors during full BUG-002 test run | PASS | None found |

## Project Persistence / Archive (BUILD-2026.07.30-project-persistence)
Verified live (Chrome automation against a local `python -m http.server`) using 4 synthetic solid-color PNG fixtures generated as test-only pixel data in the session scratchpad (no real MPS photos used, none altered). Two independent full real-browser-reload cycles were run (`navigate` to the same URL, which fully resets all in-memory JS state — confirmed each time by `photos.length===0` immediately after reload). All saved data was read back through the real `ProjectStore` (IndexedDB) API and the real Archive UI, not simulated. Test project was deleted from IndexedDB after verification to leave no residue.

| Step | Result | Evidence |
|---|---|---|
| Upload Photos | PASS | 4 real files via `file_upload` to `#photoInput`; `photos.length===4` |
| Choose Hero | PASS | `setHero(0)` → `heroIndex===0` |
| Paste event text → automatic extraction | PASS | Labelled Malay text → `eventInfo` fields populated (Tarikh/Masa/Lokasi/Jabatan/Aktiviti/Keputusan/Penutup all matched; pre-existing gap noted below) |
| Build AI Draft (multi-page) | PASS | 4 pages generated (Cover/Activity/Results/Closing), hero assigned to cover page |
| Edit title/subtitle text | PASS | `titleInput`/`subtitleInput` → `getLayerText()` matched edited values |
| Edit Facebook caption (manual override) | PASS | Appended marker text, `dataset.userEdited` set, survived save/reload |
| Hero position (drag) | PASS | Real `mousedown`/`mousemove`/`mouseup` sequence → `heroLayer` style `left/top` changed from `0,0` to `-40px,-30px` |
| Hero resize/scale (drag `.h-br` handle) | PASS | `heroLayer` style `width/height` changed from `420/356` to `445px/371px` |
| Hero rotation (drag `.h-rot` handle) | PASS | `layerData` rotation set to `40`, `heroLayer` `style.transform==='rotate(40deg)'` |
| Title layer position (drag) | PASS | Incidental real-drag also moved `titleLayer` (`-34px,-27px`) — confirms independent per-layer rects, not just hero |
| Support-slot photo position (drag `support1Layer`) | PASS | `support1Layer` style `left/top` changed from `0,364` to `20px,374px` |
| Save Project (`saveProjectNow()`) | PASS | `saveStatus` showed `Saved HH:MM:SS`; project + 4 photo Blobs written to `OCFArchiveDB` |
| **Real browser reload #1** (`navigate` to same URL) | PASS | `photos.length===0` and `window` state cleared immediately after reload, confirming a true reset, not an in-page simulation |
| Archive screen lists saved project after reload | PASS | `ProjectStore.listProjects()` and the real Archive UI both showed 1 project, 4 photos, 4 pages; thumbnail correctly rendered the rotated red hero photo |
| Open Saved Project via real "Open" button click | PASS | Photos (all 4, correct names), hero index, all 4 pages, title/subtitle text, hero position/scale/rotation, title-layer position, support1 position, event info fields, and the manually-edited Facebook caption all matched the pre-reload snapshot exactly |
| Multi-page navigation after reopen (`switchToPage` 0→1→2→3→0) | PASS | Correct title and `heroPhotoId` per page on every step |
| Export Current Page (`exportPNG()`) | PASS | No exception; canvas produced with valid non-zero dimensions |
| Export All Pages (`exportAllPages()`) | PASS | No exception across all 4 pages; original active page (0) correctly restored afterward |
| **Real browser reload #2** (second independent cycle) | PASS | Reopened the same project again after a second full reload; photos, hero index, page count, title, subtitle, hero rotation, hero position, and the edited Facebook caption all still matched |
| Console errors during full persistence test run | PASS | No exceptions thrown by any called function; no uncaught errors observed |

**Known gap, not a defect (pre-existing, out of scope for this build):** `extractEventInfo()`'s unlabelled-text fallback misread a `Maklumat Untuk Umum:` (Public Information) labelled line as the page title/summary instead of `publicInfo`, leaving `publicInfo` empty for that input. This is the same class of labelled-extraction limitation already tracked in `07_NEXT_BUILD.md`; it does not affect persistence (the field round-tripped correctly empty on save/reload) and was not touched, per the instruction not to modify unrelated modules.
