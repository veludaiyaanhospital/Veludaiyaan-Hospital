[CmdletBinding()]
param(
  [string]$OutputDir = ".deploy-site",
  [switch]$SkipPortalBuild
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot ".."))
$mainWebsitePath = Join-Path $repoRoot "main-website"
$portalPath = Join-Path $repoRoot "patient-gateway-portal"
$portalOutPath = Join-Path $portalPath "out"

if ([System.IO.Path]::IsPathRooted($OutputDir)) {
  $outputPath = [System.IO.Path]::GetFullPath($OutputDir)
} else {
  $outputPath = [System.IO.Path]::GetFullPath((Join-Path $repoRoot $OutputDir))
}

if (-not (Test-Path -LiteralPath $mainWebsitePath)) {
  throw "Missing folder: $mainWebsitePath"
}

if (-not (Test-Path -LiteralPath $portalPath)) {
  throw "Missing folder: $portalPath"
}

if (Test-Path -LiteralPath $outputPath) {
  Remove-Item -LiteralPath $outputPath -Recurse -Force
}
New-Item -ItemType Directory -Path $outputPath | Out-Null

Write-Host "Copying main website files..."
Copy-Item -Path (Join-Path $mainWebsitePath "*") -Destination $outputPath -Recurse -Force

$cleanPages = @("about", "services", "doctors", "facilities", "contact")
foreach ($page in $cleanPages) {
  $sourceFile = Join-Path $mainWebsitePath "$page.html"
  if (Test-Path -LiteralPath $sourceFile) {
    $cleanDir = Join-Path $outputPath $page
    New-Item -ItemType Directory -Path $cleanDir -Force | Out-Null
    Copy-Item -LiteralPath $sourceFile -Destination (Join-Path $cleanDir "index.html") -Force
  }
}

if (-not $SkipPortalBuild) {
  Write-Host "Building patient portal..."
  Push-Location $portalPath
  try {
    $nodeModulesPath = Join-Path $portalPath "node_modules"
    if (-not (Test-Path -LiteralPath $nodeModulesPath)) {
      Write-Host "Installing portal dependencies with npm ci..."
      & npm ci
      if ($LASTEXITCODE -ne 0) {
        throw "npm ci failed."
      }
    }

    Remove-Item Env:GITHUB_PAGES -ErrorAction SilentlyContinue
    Remove-Item Env:GITHUB_ACTIONS -ErrorAction SilentlyContinue

    & npm run build
    if ($LASTEXITCODE -ne 0) {
      throw "npm run build failed."
    }
  } finally {
    Pop-Location
  }
}

if (-not (Test-Path -LiteralPath $portalOutPath)) {
  throw "Portal export output was not found at: $portalOutPath"
}

$patientOutPath = Join-Path $portalOutPath "patient"
if (-not (Test-Path -LiteralPath $patientOutPath)) {
  throw "Portal routes export is missing at: $patientOutPath"
}

Write-Host "Copying portal routes to /patient ..."
$patientDestination = Join-Path $outputPath "patient"
New-Item -ItemType Directory -Path $patientDestination -Force | Out-Null
Copy-Item -Path (Join-Path $patientOutPath "*") -Destination $patientDestination -Recurse -Force

$nextOutPath = Join-Path $portalOutPath "_next"
if (Test-Path -LiteralPath $nextOutPath) {
  Write-Host "Copying Next.js static assets..."
  Copy-Item -Path $nextOutPath -Destination (Join-Path $outputPath "_next") -Recurse -Force
}

$sharedPortalAssets = @(
  "LOGO.png",
  "hospital-logo.jpg",
  "hospital-logo-mark.jpg"
)

foreach ($asset in $sharedPortalAssets) {
  $assetPath = Join-Path $portalOutPath $asset
  if (Test-Path -LiteralPath $assetPath) {
    Copy-Item -LiteralPath $assetPath -Destination (Join-Path $outputPath $asset) -Force
  }
}

Set-Content -Path (Join-Path $outputPath ".nojekyll") -Value "" -Encoding ascii

Write-Host "Deploy output is ready: $outputPath"
