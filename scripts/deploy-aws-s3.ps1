[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [ValidatePattern("^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$")]
  [string]$BucketName,

  [string]$Region = "ap-south-1",
  [string]$OutputDir = ".deploy-site",
  [switch]$SkipBuild
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot ".."))
$assembleScriptPath = Join-Path $PSScriptRoot "assemble-site.ps1"

function Invoke-Aws {
  param(
    [Parameter(Mandatory = $true)]
    [string[]]$Arguments,

    [switch]$IgnoreErrors
  )

  & aws @Arguments
  $exitCode = $LASTEXITCODE

  if (-not $IgnoreErrors -and $exitCode -ne 0) {
    throw "AWS CLI command failed (exit code $exitCode): aws $($Arguments -join ' ')"
  }

  return $exitCode
}

if (-not (Get-Command aws -ErrorAction SilentlyContinue)) {
  throw "AWS CLI is not installed. Install AWS CLI v2, then run this script again."
}

Write-Host "Checking AWS authentication..."
Invoke-Aws -Arguments @("sts", "get-caller-identity", "--output", "json") | Out-Null

if (-not $SkipBuild) {
  if (-not (Test-Path -LiteralPath $assembleScriptPath)) {
    throw "Build script not found: $assembleScriptPath"
  }

  & $assembleScriptPath -OutputDir $OutputDir
  if ($LASTEXITCODE -ne 0) {
    throw "Build assembly script failed."
  }
}

if ([System.IO.Path]::IsPathRooted($OutputDir)) {
  $outputPath = [System.IO.Path]::GetFullPath($OutputDir)
} else {
  $outputPath = [System.IO.Path]::GetFullPath((Join-Path $repoRoot $OutputDir))
}

$indexPath = Join-Path $outputPath "index.html"
if (-not (Test-Path -LiteralPath $indexPath)) {
  throw "Deploy output is missing index.html at: $indexPath"
}

Write-Host "Checking whether bucket exists..."
$headBucketExit = Invoke-Aws -Arguments @("s3api", "head-bucket", "--bucket", $BucketName) -IgnoreErrors
$bucketExists = $headBucketExit -eq 0

if (-not $bucketExists) {
  Write-Host "Creating bucket: $BucketName in region $Region"
  if ($Region -eq "us-east-1") {
    Invoke-Aws -Arguments @("s3api", "create-bucket", "--bucket", $BucketName, "--region", $Region) | Out-Null
  } else {
    Invoke-Aws -Arguments @(
      "s3api",
      "create-bucket",
      "--bucket",
      $BucketName,
      "--region",
      $Region,
      "--create-bucket-configuration",
      "LocationConstraint=$Region"
    ) | Out-Null
  }
} else {
  Write-Host "Bucket already exists: $BucketName"
}

Write-Host "Configuring bucket for static website hosting..."
Invoke-Aws -Arguments @(
  "s3api",
  "put-public-access-block",
  "--bucket",
  $BucketName,
  "--public-access-block-configuration",
  "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
) | Out-Null

$policyObject = @{
  Version = "2012-10-17"
  Statement = @(
    @{
      Sid = "PublicReadForWebsite"
      Effect = "Allow"
      Principal = "*"
      Action = "s3:GetObject"
      Resource = "arn:aws:s3:::$BucketName/*"
    }
  )
}
$policyJson = $policyObject | ConvertTo-Json -Depth 6 -Compress

Invoke-Aws -Arguments @(
  "s3api",
  "put-bucket-policy",
  "--bucket",
  $BucketName,
  "--policy",
  $policyJson
) | Out-Null

Invoke-Aws -Arguments @(
  "s3",
  "website",
  "s3://$BucketName/",
  "--index-document",
  "index.html",
  "--error-document",
  "index.html"
) | Out-Null

Write-Host "Uploading deploy output to S3..."
Invoke-Aws -Arguments @(
  "s3",
  "sync",
  $outputPath,
  "s3://$BucketName",
  "--delete",
  "--region",
  $Region
) | Out-Null

$websiteUrlPrimary = "http://$BucketName.s3-website.$Region.amazonaws.com"
$websiteUrlAlternate = "http://$BucketName.s3-website-$Region.amazonaws.com"
Write-Host ""
Write-Host "Deployment complete."
Write-Host "Website URL: $websiteUrlPrimary"
Write-Host "Alternate URL: $websiteUrlAlternate"
