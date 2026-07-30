<#
.SYNOPSIS
  Runs the project's real test command (if one exists), then syncs AFFiNE status on success.

.DESCRIPTION
  MPS Content Factory (OCF Beta V3.0 Editor Core) currently has no package.json and no
  automated test framework - it is a static HTML/CSS/JS app verified manually in-browser.
  This script does NOT invent a test framework. It looks for a real, existing test command
  (a "test" script in package.json, if one is ever added) and only runs that. If none exists,
  it reports that plainly and proceeds to the sync step, since there is nothing that can fail.
#>

$ErrorActionPreference = 'Stop'

$repoRoot = (git rev-parse --show-toplevel 2>$null)
if (-not $repoRoot) {
    Write-Output "FAILURE: Not inside a Git repository."
    exit 1
}
$repoRoot = $repoRoot.Trim() -replace '/', '\'

$packageJsonPath = Join-Path $repoRoot 'package.json'
$testsRan = $false

if (Test-Path $packageJsonPath) {
    try {
        $pkg = Get-Content -Path $packageJsonPath -Raw -Encoding UTF8 | ConvertFrom-Json
    } catch {
        Write-Output "FAILURE: package.json exists but could not be parsed: $($_.Exception.Message)"
        exit 1
    }
    if ($pkg.scripts -and $pkg.scripts.test) {
        Write-Output "Running project test command: npm test"
        Push-Location $repoRoot
        try {
            npm test
            $testExitCode = $LASTEXITCODE
        } finally {
            Pop-Location
        }
        $testsRan = $true
        if ($testExitCode -ne 0) {
            Write-Output "FAILURE: Tests failed (exit code $testExitCode). Build is NOT complete. Sync was not run."
            exit 1
        }
        Write-Output "Tests passed."
    }
}

if (-not $testsRan) {
    Write-Output "No automated test command found in this project (no package.json 'test' script). Skipping automated tests - manual in-browser verification is required per AFFINE_SYNC/05_TEST_RESULTS.md. Not inventing a test framework."
}

Write-Output "Running AFFiNE sync..."
$syncScript = Join-Path $repoRoot 'scripts\update-affine-sync.ps1'
$syncOutput = & $syncScript
$syncExitCode = $LASTEXITCODE
$syncOutput | ForEach-Object { Write-Output $_ }

if ($syncExitCode -ne 0) {
    Write-Output "FAILURE: AFFiNE sync step failed. See output above."
    exit 1
}

$commitHash = (git -C $repoRoot log -1 --format=%H).Trim()
$importFile = Join-Path $repoRoot 'AFFINE_SYNC\EXPORT\MPS_CONTENT_FACTORY_LATEST.md'

Write-Output "SUCCESS: Build verified and AFFiNE sync complete."
Write-Output "AFFiNE import file: $importFile"
Write-Output "Git commit hash: $commitHash"
