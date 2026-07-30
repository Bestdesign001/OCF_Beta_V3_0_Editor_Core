# Test Results

**Test capability note:** This project has no automated test framework (no `package.json`, no test runner, no test files anywhere in the repository as of this build). All results below are from manual in-browser verification. Do not invent a test framework — `scripts/run-after-build.ps1` reflects this and skips automated testing until the user commissions one.

| Test name | Expected result | Actual result | Pass/Fail | Evidence | Remaining problem |
|---|---|---|---|---|---|
| Manual: Export PNG with support slots filled | All filled support slots (1–4) appear in the exported PNG at their frame position/rotation/opacity | Not yet re-verified after this build's fix | PENDING | — | Needs a manual re-test in-browser |
| Manual: Build AI Draft multi-page generation | Every generated page's hero photo renders in the position fitted for that page | Page 3's hero photo renders in the wrong position | FAIL | User-reported runtime observation; `[diag]` logging added but not yet captured | Root cause not yet confirmed — see BUG-001 in `06_BUG_TRACKER.md` |
