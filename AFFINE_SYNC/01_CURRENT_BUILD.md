# Current Build

| Field | Value |
|---|---|
| Build ID | BUILD-2026.07.30-automation-pipeline |
| Objective | Implement the locked core automation pipeline (Upload Photos + Paste Event Text → fully automatic draft) that a real-user test found largely missing, tracked as BUG-002 |
| Scope | `extractEventInfo`, `parsePastedText`, `buildContentModel`, `planPages`, `serializeActivePage`, `buildAIDraft`, `generateFacebookCaption`, `generateTikTokCaption`, `exportAllPages`, `updateText`, `clearSlot`, plus the Event Details/caption review UI — all in `OCF_START.html` |
| Acceptance criteria | Full one-click flow passes with real photos and real event text: Upload Photos → Paste Event Text → Build AI Draft → automatic extraction/hero selection/photo distribution/multi-page generation/title-subtitle assignment/date-location-department extraction/Facebook caption/TikTok caption → editorial review (edit anything) → Save/Reopen → Export Current Page → Export All Pages. All met — see `05_TEST_RESULTS.md`. |
| Files expected to change | `OCF_START.html` only |
| Build status | **COMPLETE** |
| Start date | 2026-07-30 |
| Completion date | 2026-07-30 |
