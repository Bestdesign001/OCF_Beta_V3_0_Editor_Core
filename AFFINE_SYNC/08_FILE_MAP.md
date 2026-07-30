# File Map

**Note:** This is a static HTML/CSS/JS project — no bundler, no framework, no package.json. `OCF_START.html` (per `docs/README.txt`: "Open OCF_START.html first") is the actual, current, self-contained application: its own inline `<script>` blocks hold the live implementation, including features (Pages panel, Hero Analysis, Build AI Draft, LayoutResolver) that do not exist in `index.html`'s external script trio. `index.html` + `js/*.js` is an older/parallel copy that is kept partially in sync (e.g. the slot-lookup fix and support-slot export fix in this build were applied to both) but is behind `OCF_START.html` in features.

| Concern | File(s) / location |
|---|---|
| Entry files | `OCF_START.html` (primary, self-contained — open this one) · `index.html` + `js/screenRouter.js` + `js/factoryManager.js` + `js/app.js` (secondary/legacy split-file copy) |
| Routing files | `ScreenRouter` object (dashboard ↔ workspace screen toggle) — defined inline in `OCF_START.html`, duplicated in `js/screenRouter.js` |
| Storage files | None. No `localStorage`/`indexedDB`/server persistence found anywhere in the codebase. Confirmed by `docs/README.txt`: "Projects aren't saved between sessions in this beta." All project state (`project.pages`, `photos[]`) is in-memory only. |
| Content Model | `buildContentModel()` (OCF_START.html) |
| Template Selector | `TemplateSelector` object (OCF_START.html) |
| Layout Resolver | `LayoutResolver` object (OCF_START.html) |
| Composition Model | Return value of `LayoutResolver.resolve()` — `{templateId, elements[]}` (OCF_START.html) |
| renderComposition() | `renderComposition()` (OCF_START.html), plus its DOM-adapter helpers `applySlotFrame`, `applySlotPhoto`, `clearSlot`, `applyTextContent` |
| Export handlers | `exportPNG()`, `drawHero()`, `drawSupportSlot()`, `drawGradientOverlay()`, `drawTextLayer()`, `downloadCanvasAsPNG()` (OCF_START.html) |
| Test files | None exist in this repository |
| Styling | Inline `<style>` block in `OCF_START.html` (primary) · `css/main.css` (used by `index.html` only) |
| Docs | `docs/README.txt` (build status notes) |
