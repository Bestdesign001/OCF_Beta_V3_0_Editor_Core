# Changelog

## 2026-07-30 10:28 +0800 — 582428c
**Build:** BUILD-2026.07.30-hero-position-diag
**Summary:** Fixed a slot-image element lookup bug affecting support slots, wired support slots into PNG export, and added temporary diagnostic logging for the hero-position investigation.

- **Added:** `drawSupportSlot()` in OCF_START.html; `[diag]` console logging around `renderComposition()`/`serializeActivePage()` in `buildAIDraft()`.
- **Changed:** Slot image element lookups (`loadSlotImage`, `fitSlotToFrame`, `updateSlotImage`, `clearSlot`) now resolve via `slotId.replace('Layer','Img')` instead of `slotId+'Img'`, in both `OCF_START.html` and `js/app.js`.
- **Fixed:** `exportPNG()` now renders support slots 1–4 instead of skipping them.
- **Removed:** Nothing.
- **Files changed:** `OCF_START.html`, `js/app.js`
- **Git commit:** `582428c4677334306111f1f4dd4231d64baa4117`

## 2026-07-29 09:23 +0800 — 3ea419b
**Build:** (pre-dates AFFiNE sync; baseline checkpoint)
**Summary:** Baseline checkpoint recorded before starting the Export PNG support-slot fix.
- **Files changed:** (baseline commit — see repository history for full contents)
- **Git commit:** `3ea419b`
