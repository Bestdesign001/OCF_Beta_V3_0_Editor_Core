# Current Build

| Field | Value |
|---|---|
| Build ID | BUILD-2026.07.30-project-persistence |
| Objective | Project Persistence / Archive: a user must be able to close the browser or restart the machine, reopen OCF, and continue the same project without losing photos, event details, captions, pages, layouts, text edits, or photo assignments |
| Scope | New `ProjectStore` (IndexedDB) module; project identity fields; `serializeProjectForSave`/`saveProjectNow`/`scheduleAutoSave`/`openArchivedProject`/`duplicateArchivedProject`/`renameArchivedProject`/`deleteArchivedProject`/`renderArchiveList`; new Archive screen; Save Project button + save-status indicator; autosave hooks in `updateText`, `updateEventInfoField`, `markCaptionEdited`, `applyProps`, `setHero`, the global mouseup handler, and photo upload; fix to `Workspace.loadFactory()`'s handle-wiping bug — all in `OCF_START.html` |
| Acceptance criteria | Create Project → Upload Photos → Paste Event Text → Build Editorial Draft → Edit/Review → Save Project → **real browser reload** → Open Saved Project → continue exactly where left off (photos, hero/support assignments and positions/rotation, pages, title/subtitle, event info, captions) → Export Current Page → Export All Pages. All met, verified live including two full real-reload cycles. See `05_TEST_RESULTS.md`. |
| Files expected to change | `OCF_START.html` only |
| Build status | **COMPLETE** (core save/reopen/archive flow); large-project (300–500 photo) virtualized lazy-loading intentionally not attempted this pass — noted as a gap, not a defect |
| Start date | 2026-07-30 |
| Completion date | 2026-07-30 |
