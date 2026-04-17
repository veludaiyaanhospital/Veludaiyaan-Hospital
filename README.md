# Veludaiyaan Hospital Website Repository

This repository contains two projects:

1. `main-website/` - Static hospital website (HTML + Tailwind CDN + JS)
2. `patient-gateway-portal/` - Next.js patient portal (App Router + TypeScript)

## Live Deployment (GitHub Pages)

- Deploy workflow: `.github/workflows/deploy-pages.yml`
- Live URL: `https://veludaiyaanhospital.github.io/Veludaiyaan-Hospital/`
- Portal URL: `https://veludaiyaanhospital.github.io/Veludaiyaan-Hospital/patient/login/`

### One-time GitHub setup

1. Open repository settings.
2. Go to `Pages`.
3. Set Source to `GitHub Actions`.
4. Push to `main` (already done) and wait for the workflow to finish.

## AWS Deployment

- Deployment guide: `AWS_DEPLOY.md`
- Deploy scripts:
  - `scripts/assemble-site.ps1`
  - `scripts/deploy-aws-s3.ps1`

## Secure HMS Integration

- Architecture guide: `SECURE_HMS_INTEGRATION.md`
- Public internet deployment: `PUBLIC_PATIENT_PORTAL_DEPLOYMENT.md`
- Secure backend bridge: `patient-gateway-bridge/`
- Frontend can call the bridge when `NEXT_PUBLIC_PATIENT_GATEWAY_API_BASE_URL` is configured

Quick start command:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\deploy-aws-s3.ps1 `
  -BucketName "<your-unique-s3-bucket-name>" `
  -Region "ap-south-1"
```

## GitHub Custom Domain

- Setup guide: `GITHUB_CUSTOM_DOMAIN.md`
- GitHub Actions deployment now supports custom domains using repository variable `CUSTOM_DOMAIN`.

## Folder Structure

```txt
WEBSITE/
  main-website/
    index.html
    about.html
    services.html
    doctors.html
    facilities.html
    contact.html
    site.js
    hero.jpg
    logo.jpg
    logo1.jpg

  patient-gateway-portal/
    src/
    public/
    package.json
    next.config.ts
    README.md

  .gitignore
  README.md
```

## Run Locally

### Static website
Open:

- `main-website/index.html`

### Patient portal

```bash
cd patient-gateway-portal
npm install
npm run dev
```

Open:

- `http://localhost:3000/patient/login`

Demo OTP: `123456`

## GitHub Upload Steps

From this `WEBSITE` folder:

```bash
git init
git add .
git commit -m "Initial hospital website + patient gateway portal"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

## Notes

- `.gitignore` is configured to skip `node_modules`, `.next`, logs, and local env files.
- `main-website/site.js` already routes Patient Gateway links to:
  - local: `http://localhost:3000/patient/login`
  - hosted: `<repo-base>/patient/login`
