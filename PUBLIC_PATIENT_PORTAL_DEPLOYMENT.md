# Public Patient Portal Deployment

This setup publishes the patient portal to the internet without exposing the HMS directly.

## Recommended public architecture

1. `portal.veludaiyaanhospital.com`
   - Public patient website and patient portal frontend
   - Static Next.js export from `patient-gateway-portal/`

2. `api.veludaiyaanhospital.com`
   - Public bridge service from `patient-gateway-bridge/`
   - Handles OTP login, session cookie, patient-safe data reads, and write actions

3. HMS
   - Keep private on LAN only
   - Example private endpoint: `http://192.168.0.132:8000`
   - Do not expose this directly to the internet

## DNS

Create these DNS records:

- `portal.veludaiyaanhospital.com` -> public server IP
- `api.veludaiyaanhospital.com` -> public server IP

## Portal production env

Copy:

```txt
patient-gateway-portal/.env.production.example
```

Set:

```env
NEXT_PUBLIC_PATIENT_GATEWAY_API_BASE_URL=https://api.veludaiyaanhospital.com
```

## Bridge production env

Copy:

```txt
patient-gateway-bridge/.env.production.example
```

Important values:

- `NODE_ENV=production`
- `CORS_ORIGIN=https://portal.veludaiyaanhospital.com,https://www.veludaiyaanhospital.com`
- `SESSION_SECRET=<long random 32+ char secret>`
- `SESSION_COOKIE_DOMAIN=.veludaiyaanhospital.com`
- `HMS_BASE_URL=http://192.168.0.132:8000`

## Reverse proxy

Use:

```txt
deploy/nginx/patient-portal.conf
```

That config does this:

- forces HTTPS
- serves the public portal on `portal.veludaiyaanhospital.com`
- proxies the bridge on `api.veludaiyaanhospital.com`
- forwards client IP and HTTPS headers to the bridge

## HMS safety rules

Keep these HMS protections:

- `LAN_ONLY_MODE=true`
- HMS bound only to hospital LAN or VPN
- firewall rules allowing public access only to the bridge host, not to HMS itself

## Go-live checklist

- install SSL certificates for both public domains
- deploy portal static build to `/var/www/veludaiyaan/patient-gateway-portal/out`
- run bridge on the public server at `127.0.0.1:8080`
- reload nginx
- verify OTP request from internet
- verify login, reports download, logout
- verify HMS is not reachable from outside the hospital network

## Current limitation

This repository is now prepared for public deployment, but actual internet access still depends on:

- your DNS records
- your public server
- your SSL certificates
- your firewall/router rules
