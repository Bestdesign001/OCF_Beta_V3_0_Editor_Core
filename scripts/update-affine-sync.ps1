<#
.SYNOPSIS
  Stamps the latest Git commit info into AFFINE_SYNC/AFFINE_LATEST_UPDATE.md and
  publishes a copy to AFFINE_SYNC/EXPORT/MPS_CONTENT_FACTORY_LATEST.md for AFFiNE import.

.DESCRIPTION
  Never modifies application source files. Only touches files under AFFINE_SYNC/.
  Run this after every completed build (normally invoked by scripts/run-after-build.ps1).
#>

$ErrorActionPreference = 'Stop'

function Write-Result {
    param([bool]$Success, [string]$Message)
    if ($Success) {
        Write-Output "SUCCESS: $Message"
        exit 0
    } else {
        Write-Output "FAILURE: $Message"
        exit 1
    }
}

try {
    $repoRoot = (git rev-parse --show-toplevel 2>$null)
    if (-not $repoRoot) {
        Write-Result -Success $false -Message "Not inside a Git repository."
    }
    $repoRoot = $repoRoot.Trim() -replace '/', '\'

    $syncDir   = Join-Path $repoRoot 'AFFINE_SYNC'
    $latestMd  = Join-Path $syncDir 'AFFINE_LATEST_UPDATE.md'
    $exportDir = Join-Path $syncDir 'EXPORT'
    $exportMd  = Join-Path $exportDir 'MPS_CONTENT_FACTORY_LATEST.md'

    if (-not (Test-Path $latestMd)) {
        Write-Result -Success $false -Message "AFFINE_LATEST_UPDATE.md not found at $latestMd"
    }

    $commitHash = (git -C $repoRoot log -1 --format=%H).Trim()
    $commitDate = (git -C $repoRoot log -1 --format=%ad --date=iso).Trim()
    if (-not $commitHash) {
        Write-Result -Success $false -Message "Could not read the latest Git commit (no commits yet?)."
    }

    $changedFilesRaw = git -C $repoRoot diff-tree --no-commit-id --name-only -r $commitHash
    if (-not $changedFilesRaw) {
        $changedFilesList = "(no files changed in this commit)"
    } else {
        $changedFilesList = ($changedFilesRaw | ForEach-Object { "- $_" }) -join "`r`n"
    }

    $content = Get-Content -Path $latestMd -Raw -Encoding UTF8

    $filesPattern = '(?ms)^## Files Changed\r?\n.*?(?=^## )'
    $filesReplacement = "## Files Changed`r`n$changedFilesList`r`n`r`n"
    if ($content -notmatch $filesPattern) {
        Write-Result -Success $false -Message "AFFINE_LATEST_UPDATE.md is missing a '## Files Changed' section - not touching the file."
    }
    $content = [regex]::Replace($content, $filesPattern, { $filesReplacement })

    $commitPattern = '(?ms)^## Git Commit\r?\n.*?(?=^## )'
    $commitReplacement = "## Git Commit`r`n$commitHash - $commitDate`r`n`r`n"
    if ($content -notmatch $commitPattern) {
        Write-Result -Success $false -Message "AFFINE_LATEST_UPDATE.md is missing a '## Git Commit' section - not touching the file."
    }
    $content = [regex]::Replace($content, $commitPattern, { $commitReplacement })

    Set-Content -Path $latestMd -Value $content -Encoding UTF8 -NoNewline

    if (-not (Test-Path $exportDir)) {
        New-Item -ItemType Directory -Path $exportDir -Force | Out-Null
    }

    Copy-Item -Path $latestMd -Destination $exportMd -Force

    Write-Result -Success $true -Message "AFFINE_LATEST_UPDATE.md stamped with commit $commitHash and copied to $exportMd"
}
catch {
    Write-Result -Success $false -Message "$($_.Exception.Message)"
}
