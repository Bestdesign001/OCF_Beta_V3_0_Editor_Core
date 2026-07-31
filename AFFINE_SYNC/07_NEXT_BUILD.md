# Next Build (single approved item)

BUG-001, BUG-002, and Project Persistence / Archive are all complete and verified (see `06_BUG_TRACKER.md`, `01_CURRENT_BUILD.md`, `04_CHANGELOG.md`). No next build has been approved yet — awaiting direction from the user. Do not fill this file with unrelated future ideas; wait for an explicit next-build instruction before populating it.

Known gaps noted for awareness, not yet approved as a build:
- Location/Department/Activity/Result/Public Information/Closing extraction currently requires an explicit label in the pasted text; only Title/Subtitle/Date/Time are inferred without one.
- The Archive's project list is not virtualized/paginated — fine at normal scale, but a true 300–500 photo archive would benefit from lazy-loading rather than loading every project's metadata at once.
- `ProjectStore` is IndexedDB-only; swapping in a server-backed store (e.g. cPanel + MySQL) would need a new implementation of the same method names, not a rewrite of the editor.
