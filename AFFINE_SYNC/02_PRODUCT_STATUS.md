# Product Status — Module Tracker

Status legend: DONE (working as designed) · PARTIAL (working with known gaps) · IN PROGRESS (actively being worked) · NOT STARTED (no code exists for this module)

| Module | Status | % Complete | Working functions | Missing functions | Known bugs | Last updated commit |
|---|---|---|---|---|---|---|
| Dashboard | DONE | 100% | Factory grid render, system status panel, navigation to Workspace | Recent-projects persistence (by design — no save in this beta) | None | 3ea419b |
| Content Jobs | NOT STARTED | 0% | — | No "content job" concept exists in the codebase; closest analog is the per-project `project.pages[]` array | — | — |
| Photo Upload | DONE | 100% | File picker, drag/drop, multi-file add, dimension measurement | — | None | 3ea419b |
| Photo Queue | DONE | 100% | List render, rename, delete, loading state | Reordering | None | 3ea419b |
| Hero Selection | DONE | 100% | Manual `setHero()`, AI-scored recommendation panel, automatic assignment via `buildAIDraft()`, correct hero geometry/identity per page after BUG-001 fix | — | None open | 3decadb |
| Auto Layout | DONE | 100% | `TemplateSelector` + `LayoutResolver` + `renderComposition()` pipeline; content-section-driven multi-page `buildAIDraft()` (Cover/Activity/Results/Public Information/Closing); every uploaded photo assigned or marked unused with a reason | Text-layer frame positioning not yet applied by `renderComposition()` (deferred by design, see code comment) | None open (BUG-001 and BUG-002 fixed) | 57abfdc |
| Text Extraction | DONE | 100% | `extractEventInfo()` extracts Title/Subtitle/Date/Time/Location/Department/Activity/Result/Public Information/Closing from labelled (Tarikh/Lokasi/Tempat/Jabatan/Bahagian/Unit/Masa/Aktiviti + EN) or unstructured text (positional + date/time pattern inference). Never invents a value. | Location/Department/Activity/etc. inference for fully unlabelled text (title/subtitle/date/time only) | None known | 57abfdc |
| Editorial Review | DONE | 100% | Every automatically generated field (event details + both captions) is a live editable input/textarea | No separate approval/lock workflow (not specified beyond "user may edit anything afterwards") | None known | 57abfdc |
| Facebook Caption | DONE | 100% | `generateFacebookCaption()` — professional paragraphs, no emojis, extracted fields only | — | None known | 57abfdc |
| TikTok Caption | DONE | 100% | `generateTikTokCaption()` — shorter form + hashtags from extracted fields only | — | None known | 57abfdc |
| ETV Export | NOT STARTED | 0% | — | No platform-specific export exists; not part of the approved spec seen so far | — | — |
| Archive | NOT STARTED | 0% | — | No archival/history feature exists; projects are not persisted at all | — | — |
| Bug Tracker | N/A (process artifact) | — | Tracked in `06_BUG_TRACKER.md`, not in-app | — | — | — |

**Export PNG**: DONE for hero, title, subtitle, gradient overlay, and support slots 1–4. PARTIAL in that title/subtitle are drawn using live DOM state rather than the Composition Model's frame (matches the deferred text-positioning gap noted under Auto Layout).
**Export All Pages** (new in this build): DONE — exports every generated page as a separate PNG in one call, restoring the previously active page afterward.

Note: "Facebook Export"/"TikTok Export" in earlier drafts of this table referred to platform-specific caption generation per the approved specification, not a differently-sized/cropped image export for those platforms — that remains unbuilt and out of scope until specified.
