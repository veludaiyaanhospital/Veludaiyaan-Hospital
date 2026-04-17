# Secure HMS Integration

This repository now includes a safe integration path for connecting the patient portal to your HMS without exposing HMS credentials in the browser.

## Architecture

1. `patient-gateway-portal/`
   - Stays as the patient-facing frontend.
   - Can call a secure API bridge when `NEXT_PUBLIC_PATIENT_GATEWAY_API_BASE_URL` is set.
   - Falls back to existing mock data when the secure bridge is not configured.

2. `patient-gateway-bridge/`
   - New backend-for-frontend service.
   - Stores HMS credentials server-side only.
   - Uses HTTPS and an encrypted HttpOnly session cookie.
   - Proxies only the allowed patient endpoints to the HMS.

## Why this is safer

- No direct browser-to-HMS connection
- No HMS API key in frontend code
- Session stored in HttpOnly cookie instead of readable browser storage
- Single place for CORS, throttling, auditing, and authorization rules

## Portal configuration

Set this in the portal deployment:

```env
NEXT_PUBLIC_PATIENT_GATEWAY_API_BASE_URL=https://api.your-domain.com
```

## Bridge configuration

Copy:

```txt
patient-gateway-bridge/.env.example
```

Required values:

- `SESSION_SECRET`
- `HMS_BASE_URL`
- `CORS_ORIGIN`

Optional values:

- `SESSION_COOKIE_DOMAIN`
- `HMS_API_KEY`
- `HMS_API_KEY_HEADER`

## HMS API contract expected by the bridge

The bridge currently expects these HMS endpoints:

- `POST /auth/request-otp`
- `POST /auth/verify-otp`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /patient/me`
- `PATCH /patient/me`
- `GET /patient/visit-history`
- `GET /patient/notification-settings`
- `PATCH /patient/notification-settings`
- `POST /patient/callback-request`
- `POST /patient/support-ticket`
- `GET /patient/appointments`
- `GET /patient/prescriptions`
- `GET /patient/reports`
- `GET /patient/invoices`
- `GET /patient/outstanding-amount`
- `GET /patient/token-status`

## Bridge run commands

```bash
cd patient-gateway-bridge
npm install
npm run dev
```

Production:

```bash
cd patient-gateway-bridge
npm install
npm run build
npm start
```

## Recommended production deployment

- Host `patient-gateway-portal` on the website domain
- Host `patient-gateway-bridge` on `api.your-domain.com`
- Force HTTPS
- Restrict HMS access so only the bridge can reach it
- Add request logging, rate limiting, and WAF rules before go-live

## Important note

The bridge is ready for safe integration scaffolding, but the final HMS hookup still depends on your actual HMS endpoint format and authentication method.
