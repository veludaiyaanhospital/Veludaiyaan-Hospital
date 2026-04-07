# Veludaiyaan Hospital Patient Gateway Portal

Production-style patient-facing portal built with Next.js App Router, TypeScript, Tailwind, shadcn-style UI, React Query, Zustand, Framer Motion, and zod/react-hook-form.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn-style local UI components
- lucide-react icons
- Zustand (client session and preferences)
- React Query (API-ready service layer calls)
- Framer Motion (subtle motion)
- zod + react-hook-form (form validation)

## Routes

- `/patient/login`
- `/patient/register`
- `/patient/forgot-access`
- `/patient/dashboard`
- `/patient/token-status`
- `/patient/appointments`
- `/patient/prescriptions`
- `/patient/reports`
- `/patient/profile`
- `/patient/support`
- `/patient/settings`

## Project Structure

```txt
src/
  app/
    patient/
      (auth)/
        login/
        register/
        forgot-access/
      (protected)/
        dashboard/
        token-status/
        appointments/
        prescriptions/
        reports/
        profile/
        support/
        settings/
  components/
    patient/
      PatientSidebar, PatientTopbar, PatientSummaryCards,
      TokenLiveCard, QueueProgress, AppointmentCard,
      PrescriptionCard, ReportCard,
      ProfileForm, NotificationSettings, ProtectedRoute,
      OtpLoginForm, FloatingWhatsApp, PatientMobileNav
    ui/
      shared shadcn-style primitives + EmptyState/ErrorState/LoadingSkeleton
  hooks/
    use-auth.ts
    use-patient-queries.ts
  lib/
    api/
      authService.ts
      patientService.ts
      tokenService.ts
      appointmentService.ts
      prescriptionService.ts
      reportService.ts
      client.ts
    auth/
      paths.ts
      session.ts
    i18n/
      patient-copy.ts
    mock/
      patient-data.ts
    types/
      auth.ts
      patient.ts
  store/
    auth-store.ts
    patient-preferences-store.ts
```

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Demo login OTP is `123456`.

## Environment Placeholders

See [`.env.example`](./.env.example).

Key frontend variable:
- `NEXT_PUBLIC_PATIENT_GATEWAY_API_BASE_URL`

## How to Connect This Later to HMS

### 1. Where to connect HMS auth

- File: `src/lib/api/authService.ts`
- Replace mock logic in:
  - `requestOtp()`
  - `verifyOtp()`
  - `refreshSession()`
  - `logout()`
- Keep method signatures stable so UI remains unchanged.

### 2. Where to connect patient master data

- File: `src/lib/api/patientService.ts`
- Connect:
  - `getCurrentPatient()`
  - `updatePatientProfile()`
  - `getVisitHistory()`
  - `getNotificationSettings()`
  - `updateNotificationSettings()`

### 3. Where to connect token queue API

- File: `src/lib/api/tokenService.ts`
- Connect `getTokenStatus()` to real live queue endpoint.

### 4. Where to connect prescriptions API

- File: `src/lib/api/prescriptionService.ts`
- Connect `getPrescriptions()` and PDF retrieval endpoints.

### 5. Where to connect reports API

- File: `src/lib/api/reportService.ts`
- Connect `getReports()` and secure report file preview/download endpoints.

### 6. Core API abstraction details

- Shared API behavior entry: `src/lib/api/client.ts`
- Keep UI independent of backend schema by mapping API responses to `src/lib/types/*` before returning to components.

## What Must Move to Backend Before Production

- OTP verification and provider integration
- Session issuance, refresh, revocation
- All patient data access checks and authorization decisions
- Report/prescription/receipt file signing and access control
- Audit and activity log writes
- Rate-limit and abuse protection controls

## Security Notes Already Baked into Code

Comments in the service layer explicitly mark:
- object-level authorization must be enforced server-side for every patient record request
- never trust patient ID coming directly from client
- remote access should sit behind a secure API gateway / zero-trust or VPN-backed architecture

## Production Cautions (Mandatory Before Live Deployment)

- Real OTP provider
- Backend auth/session validation
- HTTPS everywhere
- Audit logs
- Server-side authorization
- Rate limiting
- File access control
- Encrypted storage
- Session expiry enforcement
- Activity logging

## Build Validation

- `npm run lint` passes
- `npm run build` passes
