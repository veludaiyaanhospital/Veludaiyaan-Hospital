# AWS Deployment (S3 Static Hosting)

This repository now includes AWS deployment scripts:

- `scripts/assemble-site.ps1`
- `scripts/deploy-aws-s3.ps1`

## 1. Prerequisites

1. Install Node.js 20+.
2. Install AWS CLI v2.
3. Configure AWS credentials:
   ```powershell
   aws configure
   ```
4. Use an IAM identity with S3 permissions for:
   - `s3:CreateBucket`
   - `s3:PutBucketPolicy`
   - `s3:PutPublicAccessBlock`
   - `s3:PutBucketWebsite`
   - `s3:ListBucket`
   - `s3:GetObject`
   - `s3:PutObject`
   - `s3:DeleteObject`

## 2. One-command Deploy

From repo root (`WEBSITE`):

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\deploy-aws-s3.ps1 `
  -BucketName "veludaiyaan-hospital-prod-123456" `
  -Region "ap-south-1"
```

What this does:

1. Builds and exports the patient portal (`next build` with static output).
2. Assembles a combined `.deploy-site` folder:
   - Root website from `main-website`
   - Portal routes under `/patient`
   - Next static assets (`/_next`)
3. Creates the S3 bucket if it does not exist.
4. Enables static website hosting.
5. Applies public read policy for website files.
6. Uploads all files with sync and deletes removed files.

## 3. Redeploy After Changes

Run the same deploy command again.

If `.deploy-site` is already prepared and you only want to upload:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\deploy-aws-s3.ps1 `
  -BucketName "veludaiyaan-hospital-prod-123456" `
  -Region "ap-south-1" `
  -SkipBuild
```

## 4. Important Production Note

This script uses direct S3 static website hosting (public bucket). It is the fastest path to go live.

For HTTPS and better security/performance, place CloudFront in front of the bucket and attach an ACM certificate (recommended for production).
