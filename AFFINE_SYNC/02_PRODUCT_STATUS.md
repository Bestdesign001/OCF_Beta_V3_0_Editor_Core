# Product Status — Module Tracker

Status legend: DONE (working as designed) · PARTIAL (working with known gaps) · IN PROGRESS (actively being worked) · NOT STARTED (no code exists for this module)

| Module | Status | % Complete | Working functions | Missing functions | Known bugs | Last updated commit |
|---|---|---|---|---|---|---|
| Dashboard | DONE | 100% | Factory grid render, system status panel, navigation to Workspace | Recent-projects persistence (by design — no save in this beta) | None | 3ea419b |
| Content Jobs | NOT STARTED | 0% | — | No "content job" concept exists in the codebase; closest analog is the per-project `project.pages[]` array | — | — |
| Photo Upload | DONE | 100% | File picker, drag/drop, multi-file add, dimension measurement | — | None | 3ea419b |
| Photo Queue | DONE | 100% | List render, rename, delete, loading state | Reordering | None | 3ea419b |
| Hero Selection | DONE | 100% | Manual `setHero()`, AI-scored recommendation panel (display-only, never auto-assigns), correct hero geometry/identity per page after BUG-001 fix | — | None open | 3decadb |
| Auto Layout | DONE | 90% | `TemplateSelector` + `LayoutResolver` + `renderComposition()` pipeline; single-page `autoLayout()`; multi-page `buildAIDraft()` — hero geometry and identity now correct on every generated page | Text-layer frame positioning not yet applied by `renderComposition()` (deferred by design, see code comment) | None open (BUG-001 fixed) | 3decadb |
| Text Extraction | DONE | 100% | `parsePastedText()` splits pasted text into title (first line) + subtitle (remaining lines) | No smarter parsing (e.g. structured WhatsApp message fields) | None known | 3ea419b |
| Editorial Review | NOT STARTED | 0% | — | No review/approval step exists between draft and export | — | — |
| Facebook Export | NOT STARTED | 0% | — | No platform-specific export exists; only generic PNG export | — | — |
| TikTok Export | NOT STARTED | 0% | — | No platform-specific export exists | — | — |
| ETV Export | NOT STARTED | 0% | — | No platform-specific export exists | — | — |
| Archive | NOT STARTED | 0% | — | No archival/history feature exists; projects are not persisted at all | — | — |
| Bug Tracker | N/A (process artifact) | — | Tracked in `06_BUG_TRACKER.md`, not in-app | — | — | — |

**Export PNG** (not in the user's tracked list above, but the terminal step of Auto Layout): DONE for hero, title, subtitle, gradient overlay, and — as of this build — support slots 1–4. PARTIAL in that title/subtitle are drawn using live DOM state rather than the Composition Model's frame (matches the deferred text-positioning gap noted under Auto Layout).
