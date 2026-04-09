# GitHub Pages Custom Domain Setup

This repo already deploys to GitHub Pages using `.github/workflows/deploy-pages.yml`.

The workflow is now configured to publish a `CNAME` file automatically when you set a repository variable named `CUSTOM_DOMAIN`.

## 1. Set your domain in GitHub

1. Open repository `Settings` -> `Pages`.
2. Under **Custom domain**, enter your domain (example: `www.example.com` or `example.com`) and save.
3. Open `Settings` -> `Secrets and variables` -> `Actions` -> `Variables`.
4. Create/update variable:
   - Name: `CUSTOM_DOMAIN`
   - Value: your same domain from Pages settings

## 2. Configure DNS at your domain provider

Use your GitHub account domain root (`veludaiyaanhospital.github.io`) as the target for CNAME.

If using apex domain (`example.com`):

- Add `A` records for `@`:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- Optional `AAAA` records for `@`:
  - `2606:50c0:8000::153`
  - `2606:50c0:8001::153`
  - `2606:50c0:8002::153`
  - `2606:50c0:8003::153`

If using `www` subdomain:

- Add `CNAME` record:
  - Host: `www`
  - Target: `veludaiyaanhospital.github.io`

Recommended:

1. Set `www` as primary domain in GitHub Pages.
2. Also configure apex records so `example.com` redirects to `www.example.com`.

## 3. Deploy

Push any commit to `main` (or run the workflow manually). The workflow will:

1. Build the patient portal.
2. Assemble static artifact.
3. Write `CNAME` from `CUSTOM_DOMAIN`.
4. Deploy to GitHub Pages.

## 4. Enable HTTPS

After DNS propagates (can take up to 24 hours), open `Settings` -> `Pages` and enable **Enforce HTTPS**.
