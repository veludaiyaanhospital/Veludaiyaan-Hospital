import cookieParser from "cookie-parser";
import crypto from "node:crypto";
import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import { z } from "zod";

import { config } from "./config.js";
import { HmsHttpError, hmsFetch, hmsRequest } from "./hms-client.js";
import { buildSessionCookie, sealSession, unsealSession, type GatewaySession } from "./session.js";

interface RateLimitState {
  count: number;
  resetAt: number;
}

const app = express();
app.set("trust proxy", 1);
const rateLimitBuckets = new Map<string, RateLimitState>();

const otpRequestSchema = z.object({
  mobile: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit mobile number."),
  uhid: z.string().optional(),
});

const otpVerifySchema = otpRequestSchema.extend({
  otp: z.string().regex(/^\d{4,8}$/, "Enter a valid OTP."),
});

const callbackSchema = z.object({
  preferredSlot: z.string().min(1),
  reason: z.string().min(1),
  mobile: z.string().regex(/^\d{10}$/),
});

const supportTicketSchema = z.object({
  category: z.enum(["Access", "Appointment", "Billing", "Medical Record", "Other"]),
  subject: z.string().min(1),
  message: z.string().min(1),
});

const patientProfileUpdateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().optional(),
  age: z.number().int().min(0).max(130).optional(),
  sex: z.enum(["Male", "Female", "Other"]).optional(),
  mobile: z.string().regex(/^\d{10}$/).optional(),
  email: z.string().optional(),
  uhid: z.string().optional(),
  bloodGroup: z.string().optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  primaryDoctor: z.string().optional(),
  department: z.string().optional(),
  nextFollowUp: z.string().optional(),
});

type PortalRole = "patient";
type PortalStage = "Visit" | "Waiting" | "Seen";
type PortalAppointmentStatus = "Visit" | "Waiting" | "Seen";
type PortalPrescriptionStatus = "Ready" | "Pending";
type PortalReportStatus = "Processing" | "Ready" | "Reviewed";
type PortalInvoiceStatus = "Paid" | "Unpaid";
type PortalPaymentMode = "UPI" | "Card" | "Cash" | "Insurance" | "Net Banking";

interface HmsOtpResponse {
  message?: string;
  maskedPhone?: string | null;
  expiresInSeconds?: number;
}

interface HmsAuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
  refreshExpiresAt?: string;
  roles?: string[];
  patient?: {
    id?: number | string;
  };
}

interface PortalOtpResponse {
  requestId: string;
  maskedMobile: string;
  expiresInSeconds: number;
}

interface PortalPatient {
  id: string;
  uhid: string;
  firstName: string;
  lastName: string;
  age: number;
  sex: "Male" | "Female" | "Other";
  bloodGroup: string;
  mobile: string;
  email?: string;
  address: string;
  emergencyContact: string;
  primaryDoctor: string;
  department: string;
  nextFollowUp: string;
  avatarUrl?: string;
}

interface PortalAppointment {
  id: string;
  dateTime: string;
  doctorName: string;
  department: string;
  type: "New" | "Follow-up" | "Review";
  mode: "In Person" | "Video";
  status: PortalAppointmentStatus;
  notes?: string;
  room?: string;
}

interface PortalTokenStep {
  label: string;
  stage: PortalStage;
  timestamp?: string;
  completed: boolean;
  current: boolean;
}

interface PortalTokenStatus {
  tokenNumber: string;
  queuePosition: number;
  patientsAhead: number;
  consultationRoom: string;
  status: PortalStage;
  estimatedWaitMinutes: number;
  updatedAt: string;
  isNext: boolean;
  timeline: PortalTokenStep[];
}

interface PortalPrescriptionMedicine {
  medicine: string;
  dosage: string;
  duration: string;
  instructions: string;
}

interface PortalPrescription {
  id: string;
  visitDate: string;
  doctorName: string;
  department: string;
  diagnosisSummary: string;
  medicines: PortalPrescriptionMedicine[];
  status: PortalPrescriptionStatus;
  pdfUrl: string;
}

interface PortalReport {
  id: string;
  testName: string;
  type: "Lab" | "Imaging" | "Cardio";
  orderedDate: string;
  updatedDate: string;
  status: PortalReportStatus;
  previewSummary: string;
  fileUrl: string;
}

interface PortalInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  category: string;
  status: PortalInvoiceStatus;
  amount: number;
  paymentMode: PortalPaymentMode;
  receiptUrl: string;
}

interface PortalVisitHistoryItem {
  id: string;
  dateTime: string;
  doctorName: string;
  department: string;
  outcome: string;
  followUpDate?: string;
}

interface PortalNotificationSettings {
  language: "en";
  sms: boolean;
  whatsapp: boolean;
  email: boolean;
  appointmentReminders: boolean;
  reportAlerts: boolean;
  billingAlerts: boolean;
  profileVisibility: "private" | "care-team-only";
}

interface HmsNotificationSettingsResponse {
  language?: string;
  sms?: boolean;
  whatsapp?: boolean;
  email?: boolean;
  appointmentReminders?: boolean;
  reportAlerts?: boolean;
  billingAlerts?: boolean;
  profileVisibility?: "private" | "care-team-only";
}

interface HmsTicketResponse {
  ticketId: string;
  status?: string;
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || config.corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by CORS."));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "256kb" }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "same-origin");
  if (req.path.startsWith("/auth") || req.path.startsWith("/patient")) {
    res.setHeader("Cache-Control", "no-store");
  }
  next();
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

function toIsoAfterSeconds(seconds: number) {
  return new Date(Date.now() + Math.max(60, seconds) * 1000).toISOString();
}

function splitName(fullName: string | null | undefined) {
  const clean = String(fullName ?? "").trim();
  if (!clean) {
    return { firstName: "Patient", lastName: "" };
  }

  const parts = clean.split(/\s+/);
  return {
    firstName: parts[0] ?? "Patient",
    lastName: parts.slice(1).join(" "),
  };
}

function mapGender(value: unknown): PortalPatient["sex"] {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (["male", "m"].includes(normalized)) {
    return "Male";
  }
  if (["female", "f"].includes(normalized)) {
    return "Female";
  }
  return "Other";
}

function mapPortalStage(value: unknown): PortalStage {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (normalized === "waiting") {
    return "Waiting";
  }
  if (["seen", "completed", "medicine collected", "collect medicine"].includes(normalized)) {
    return "Seen";
  }
  return "Visit";
}

function mapAppointmentStatus(value: unknown, dateTime?: string): PortalAppointmentStatus {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (["waiting", "checked_in", "arrived"].includes(normalized)) {
    return "Waiting";
  }
  if (["seen", "completed", "done", "closed"].includes(normalized)) {
    return "Seen";
  }
  if (dateTime && new Date(dateTime).getTime() < Date.now()) {
    return "Seen";
  }
  return "Visit";
}

function mapAppointmentType(reason: unknown): PortalAppointment["type"] {
  const normalized = String(reason ?? "").trim().toLowerCase();
  if (normalized.includes("review")) {
    return "Review";
  }
  if (normalized.includes("follow")) {
    return "Follow-up";
  }
  return "New";
}

function mapReportType(value: unknown): PortalReport["type"] {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (normalized.includes("xray") || normalized.includes("x-ray") || normalized.includes("scan") || normalized.includes("imaging")) {
    return "Imaging";
  }
  if (normalized.includes("ecg") || normalized.includes("echo") || normalized.includes("cardio")) {
    return "Cardio";
  }
  return "Lab";
}

function mapReportStatus(value: unknown): PortalReportStatus {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (["reviewed", "verified", "approved"].includes(normalized)) {
    return "Reviewed";
  }
  if (["ready", "completed", "final"].includes(normalized)) {
    return "Ready";
  }
  return "Processing";
}

function mapInvoiceStatus(row: Record<string, unknown>): PortalInvoiceStatus {
  const paymentStatus = String(row.payment_status ?? "").trim().toLowerCase();
  const billStatus = String(row.bill_status ?? "").trim().toLowerCase();
  if (["paid", "completed", "success"].includes(paymentStatus) || ["paid", "completed"].includes(billStatus)) {
    return "Paid";
  }
  return "Unpaid";
}

function mapPaymentMode(value: unknown): PortalPaymentMode {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (normalized.includes("upi")) return "UPI";
  if (normalized.includes("card")) return "Card";
  if (normalized.includes("cash")) return "Cash";
  if (normalized.includes("insurance")) return "Insurance";
  return "Net Banking";
}

function asNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function joinAddress(...parts: unknown[]) {
  return parts
    .map((part) => String(part ?? "").trim())
    .filter(Boolean)
    .join(", ");
}

function buildGatewayUrl(req: Request, path: string) {
  const forwardedProto = String(req.headers["x-forwarded-proto"] ?? "").split(",")[0].trim();
  const protocol = forwardedProto || req.protocol;
  return `${protocol}://${req.get("host")}${path}`;
}

function extractPhoneDigits(value: unknown) {
  return String(value ?? "").replace(/\D/g, "").slice(-10);
}

function splitEmergencyContact(value: unknown) {
  const raw = String(value ?? "").trim();
  const phone = extractPhoneDigits(raw);
  if (!raw) {
    return { name: undefined, phone: undefined };
  }

  const name = raw.replace(/[\s,/-]*\d[\d\s()-]*$/, "").trim() || raw;
  return {
    name: name || undefined,
    phone: phone || undefined,
  };
}

function getSession(req: Request) {
  const cookieValue = req.cookies[config.sessionCookieName];
  if (!cookieValue || typeof cookieValue !== "string") {
    return null;
  }

  return unsealSession(cookieValue);
}

function requireSession(req: Request, res: Response, next: NextFunction) {
  const session = getSession(req);
  if (!session) {
    res.status(401).json({ message: "Patient session is missing or expired." });
    return;
  }

  res.locals.session = session;
  next();
}

function setSessionCookie(res: Response, session: GatewaySession) {
  res.cookie(config.sessionCookieName, sealSession(session), buildSessionCookie(session.refreshExpiresAt));
}

function clearSessionCookie(res: Response) {
  res.clearCookie(config.sessionCookieName, {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "lax",
    domain: config.sessionCookieDomain,
    path: "/",
  });
}

function asyncRoute(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, next).catch(next);
  };
}

function getForwardHeaders(req: Request) {
  return {
    ...(req.get("origin") ? { "X-Portal-Origin": req.get("origin") as string } : {}),
    ...(req.get("user-agent") ? { "User-Agent": req.get("user-agent") as string } : {}),
    ...(req.get("x-request-id") ? { "X-Request-ID": req.get("x-request-id") as string } : {}),
  };
}

function getClientIp(req: Request) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0]!.trim();
  }
  return req.ip || req.socket.remoteAddress || "unknown";
}

function enforceRateLimit(req: Request, res: Response, key: string, max: number) {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    rateLimitBuckets.set(key, {
      count: 1,
      resetAt: now + config.authRateLimitWindowMs,
    });
    return false;
  }

  if (bucket.count >= max) {
    const retryAfterSeconds = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
    res.setHeader("Retry-After", String(retryAfterSeconds));
    res.status(429).json({ message: "Too many requests. Please try again shortly." });
    return true;
  }

  bucket.count += 1;
  return false;
}

function toGatewaySession(payload: HmsAuthResponse): GatewaySession {
  const expiresAt = toIsoAfterSeconds(asNumber(payload.expiresInSeconds, 900));
  return {
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
    patientId: String(payload.patient?.id ?? ""),
    expiresAt,
    refreshExpiresAt: payload.refreshExpiresAt ?? toIsoAfterSeconds(30 * 24 * 60 * 60),
    role: "patient",
  };
}

function buildOtpResponse(payload: HmsOtpResponse): PortalOtpResponse {
  return {
    requestId: crypto.randomUUID(),
    maskedMobile: String(payload.maskedPhone ?? ""),
    expiresInSeconds: asNumber(payload.expiresInSeconds, 300),
  };
}

function mapAppointment(req: Request, row: Record<string, unknown>): PortalAppointment {
  const dateTime = String(row.scheduled_start ?? row.dateTime ?? new Date().toISOString());
  return {
    id: String(row.id ?? row.appointment_id ?? crypto.randomUUID()),
    dateTime,
    doctorName: String(row.doctor_name ?? row.doctorName ?? "Care Team"),
    department: String(row.department ?? "General"),
    type: mapAppointmentType(row.reason),
    mode: "In Person",
    status: mapAppointmentStatus(row.status, dateTime),
    notes: String(row.reason ?? "").trim() || undefined,
    room: String(row.room ?? row.consultation_room ?? "").trim() || undefined,
  };
}

function mapPatientProfile(req: Request, patient: Record<string, unknown>, appointments: PortalAppointment[]): PortalPatient {
  const { firstName, lastName } = splitName(patient.full_name as string | undefined);
  const nextAppointment =
    appointments.find((item) => item.status === "Visit") ??
    appointments.find((item) => item.status === "Waiting") ??
    appointments[0];

  return {
    id: String(patient.id ?? ""),
    uhid: String(patient.mrn ?? patient.uhid ?? ""),
    firstName,
    lastName,
    age: asNumber(patient.age),
    sex: mapGender(patient.gender),
    bloodGroup: String(patient.blood_group ?? "Not Recorded"),
    mobile: String(patient.phone ?? ""),
    email: String(patient.email ?? "").trim() || undefined,
    address: joinAddress(
      patient.address_line1,
      patient.address_line2,
      patient.city,
      patient.state,
      patient.pincode,
    ),
    emergencyContact:
      joinAddress(patient.emergency_contact_name, patient.emergency_contact_phone) ||
      String(patient.phone ?? "Not provided"),
    primaryDoctor: nextAppointment?.doctorName ?? "Care Team",
    department: nextAppointment?.department ?? "General",
    nextFollowUp: nextAppointment?.dateTime ?? new Date().toISOString(),
    avatarUrl: undefined,
  };
}

function buildTokenTimeline(status: PortalStage, updatedAt: string): PortalTokenStep[] {
  const currentIndex = status === "Visit" ? 0 : status === "Waiting" ? 1 : 2;
  const labels: Array<{ label: string; stage: PortalStage }> = [
    { label: "Visit (Appointment Booked)", stage: "Visit" },
    { label: "Waiting", stage: "Waiting" },
    { label: "Seen", stage: "Seen" },
  ];

  return labels.map((item, index) => ({
    ...item,
    timestamp: index <= currentIndex ? updatedAt : undefined,
    completed: index < currentIndex || status === "Seen",
    current: index === currentIndex,
  }));
}

function mapTokenStatus(snapshot: Record<string, unknown>): PortalTokenStatus {
  const status = mapPortalStage(snapshot.workflowStatus);
  const queuePosition = status === "Visit" ? 3 : status === "Waiting" ? 1 : 0;
  const updatedAt = String(snapshot.lastUpdatedAt ?? new Date().toISOString());

  return {
    tokenNumber: String(snapshot.tokenNumber ?? snapshot.visitId ?? "OPD"),
    queuePosition,
    patientsAhead: Math.max(0, queuePosition - 1),
    consultationRoom: String(snapshot.consultationRoom ?? "Main OP"),
    status,
    estimatedWaitMinutes: status === "Seen" ? 0 : queuePosition * 10,
    updatedAt,
    isNext: queuePosition === 1,
    timeline: buildTokenTimeline(status, updatedAt),
  };
}

function mapPrescription(req: Request, row: Record<string, unknown>): PortalPrescription {
  const items = Array.isArray(row.items) ? row.items : [];
  return {
    id: String(row.prescription_id ?? row.id ?? crypto.randomUUID()),
    visitDate: String(row.prescribed_at ?? row.visitDate ?? new Date().toISOString()),
    doctorName: String(row.doctor_name ?? row.doctorName ?? "Doctor"),
    department: String(row.department ?? "General"),
    diagnosisSummary: String(row.diagnosis ?? row.chief_complaints ?? "Consultation notes available in HMS."),
    status: String(row.status ?? "").trim().toLowerCase() === "active" ? "Ready" : "Ready",
    pdfUrl: "",
    medicines: items.map((item) => ({
      medicine: String((item as Record<string, unknown>).medicine ?? (item as Record<string, unknown>).drug_name ?? "Medicine"),
      dosage: String((item as Record<string, unknown>).dose ?? "As advised"),
      duration: String(
        (item as Record<string, unknown>).duration_days
          ? `${String((item as Record<string, unknown>).duration_days)} days`
          : (item as Record<string, unknown>).duration_weeks
            ? `${String((item as Record<string, unknown>).duration_weeks)} weeks`
            : "As advised",
      ),
      instructions: String((item as Record<string, unknown>).instructions ?? (item as Record<string, unknown>).frequency ?? "Follow doctor advice"),
    })),
  };
}

function mapReport(req: Request, row: Record<string, unknown>): PortalReport {
  const reportId = String(row.id ?? row.report_id ?? crypto.randomUUID());
  const updatedDate = String(row.updated_at ?? row.created_at ?? new Date().toISOString());
  const orderedDate = String(row.created_at ?? updatedDate);
  const summary =
    String(row.summary ?? row.preview_summary ?? row.impression ?? row.notes ?? "Report is available in the HMS record.").trim();

  return {
    id: reportId,
    testName: String(row.report_name ?? row.test_name ?? row.title ?? `Report ${reportId}`),
    type: mapReportType(row.report_type ?? row.category ?? row.modality),
    orderedDate,
    updatedDate,
    status: mapReportStatus(row.status),
    previewSummary: summary,
    fileUrl: buildGatewayUrl(req, `/patient/reports/${encodeURIComponent(reportId)}/download`),
  };
}

function mapInvoice(req: Request, row: Record<string, unknown>): PortalInvoice {
  return {
    id: String(row.id ?? crypto.randomUUID()),
    invoiceNumber: String(row.invoice_no ?? row.invoiceNumber ?? ""),
    date: String(row.invoice_date ?? row.date ?? new Date().toISOString()),
    category: String(row.billing_source ?? row.category ?? "Other"),
    status: mapInvoiceStatus(row),
    amount: asNumber(row.total),
    paymentMode: mapPaymentMode(row.payment_method),
    receiptUrl: "",
  };
}

function buildDefaultNotificationSettings(): PortalNotificationSettings {
  return {
    language: "en",
    sms: true,
    whatsapp: true,
    email: false,
    appointmentReminders: true,
    reportAlerts: true,
    billingAlerts: true,
    profileVisibility: "care-team-only",
  };
}

function mapNotificationSettings(payload: HmsNotificationSettingsResponse | null | undefined): PortalNotificationSettings {
  const defaults = buildDefaultNotificationSettings();
  return {
    language: "en",
    sms: payload?.sms ?? defaults.sms,
    whatsapp: payload?.whatsapp ?? defaults.whatsapp,
    email: payload?.email ?? defaults.email,
    appointmentReminders: payload?.appointmentReminders ?? defaults.appointmentReminders,
    reportAlerts: payload?.reportAlerts ?? defaults.reportAlerts,
    billingAlerts: payload?.billingAlerts ?? defaults.billingAlerts,
    profileVisibility: payload?.profileVisibility ?? defaults.profileVisibility,
  };
}

app.post(
  "/auth/request-otp",
  asyncRoute(async (req, res) => {
    const ip = getClientIp(req);
    if (enforceRateLimit(req, res, `otp-request:${ip}`, config.otpRequestRateLimitMax)) {
      return;
    }

    const payload = otpRequestSchema.parse(req.body);
    const result = await hmsRequest<HmsOtpResponse>("/api/patient/auth/request-otp", {
      method: "POST",
      body: {
        phone: payload.mobile,
        mrn: payload.uhid,
      },
      headers: getForwardHeaders(req),
    });

    res.json(buildOtpResponse(result));
  }),
);

app.post(
  "/auth/verify-otp",
  asyncRoute(async (req, res) => {
    const ip = getClientIp(req);
    if (enforceRateLimit(req, res, `otp-verify:${ip}`, config.otpVerifyRateLimitMax)) {
      return;
    }

    const payload = otpVerifySchema.parse(req.body);
    const result = await hmsRequest<HmsAuthResponse>("/api/patient/auth/verify-otp", {
      method: "POST",
      body: {
        phone: payload.mobile,
        otp: payload.otp,
        mrn: payload.uhid,
      },
      headers: getForwardHeaders(req),
    });
    const session = toGatewaySession(result);

    setSessionCookie(res, session);
    res.json({
      token: "server-session",
      refreshToken: "server-session",
      expiresAt: session.expiresAt,
      patientId: session.patientId,
      role: session.role as PortalRole,
    });
  }),
);

app.post(
  "/auth/refresh",
  asyncRoute(async (req, res) => {
    const ip = getClientIp(req);
    if (enforceRateLimit(req, res, `refresh:${ip}`, config.refreshRateLimitMax)) {
      return;
    }

    const session = getSession(req);
    const refreshToken = typeof req.body?.refreshToken === "string" ? req.body.refreshToken : session?.refreshToken;

    if (!refreshToken) {
      res.status(401).json({ message: "Refresh token is missing." });
      return;
    }

    const result = await hmsRequest<HmsAuthResponse>("/api/patient/auth/refresh", {
      method: "POST",
      body: { refreshToken },
      headers: getForwardHeaders(req),
    });
    const nextSession = toGatewaySession(result);

    setSessionCookie(res, nextSession);
    res.json({
      token: "server-session",
      refreshToken: "server-session",
      expiresAt: nextSession.expiresAt,
      patientId: nextSession.patientId,
      role: nextSession.role as PortalRole,
    });
  }),
);

app.post(
  "/auth/logout",
  asyncRoute(async (req, res) => {
    const session = getSession(req);
    if (session) {
      try {
        await hmsRequest("/api/patient/auth/logout", {
          method: "POST",
          body: { refreshToken: session.refreshToken },
          session,
          headers: getForwardHeaders(req),
        });
      } catch {
        // Clear local session even if upstream logout is unavailable.
      }
    }

    clearSessionCookie(res);
    res.status(204).send();
  }),
);

app.get(
  "/patient/me",
  requireSession,
  asyncRoute(async (req, res) => {
    const session = res.locals.session as GatewaySession;
    const [patient, appointments] = await Promise.all([
      hmsRequest<Record<string, unknown>>("/api/patient/me", { session, headers: getForwardHeaders(req) }),
      hmsRequest<Array<Record<string, unknown>>>("/api/patient/appointments?limit=5", {
        session,
        headers: getForwardHeaders(req),
      }),
    ]);

    const mappedAppointments = appointments.map((item) => mapAppointment(req, item));
    res.json(mapPatientProfile(req, patient, mappedAppointments));
  }),
);

app.patch(
  "/patient/me",
  requireSession,
  asyncRoute(async (req, res) => {
    const payload = patientProfileUpdateSchema.parse(req.body);
    const fullName = [payload.firstName, payload.lastName].filter(Boolean).join(" ").trim();
    const emergency = splitEmergencyContact(payload.emergencyContact);
    const result = await hmsRequest<Record<string, unknown>>("/api/patient/me", {
      method: "PATCH",
      body: {
        ...(fullName ? { full_name: fullName } : {}),
        ...(payload.age !== undefined ? { age: payload.age } : {}),
        ...(payload.sex ? { gender: payload.sex } : {}),
        ...(payload.mobile ? { phone: payload.mobile } : {}),
        ...(payload.email !== undefined ? { email: payload.email } : {}),
        ...(payload.address !== undefined ? { address_line1: payload.address } : {}),
        ...(payload.bloodGroup !== undefined ? { blood_group: payload.bloodGroup } : {}),
        ...(emergency.name !== undefined ? { emergency_contact_name: emergency.name } : {}),
        ...(emergency.phone !== undefined ? { emergency_contact_phone: emergency.phone } : {}),
      },
      session: res.locals.session as GatewaySession,
      headers: getForwardHeaders(req),
    });
    const appointments = await hmsRequest<Array<Record<string, unknown>>>("/api/patient/appointments?limit=5", {
      session: res.locals.session as GatewaySession,
      headers: getForwardHeaders(req),
    });
    res.json(mapPatientProfile(req, result, appointments.map((item) => mapAppointment(req, item))));
  }),
);

app.get(
  "/patient/visit-history",
  requireSession,
  asyncRoute(async (req, res) => {
    const appointments = await hmsRequest<Array<Record<string, unknown>>>("/api/patient/appointments?limit=50", {
      session: res.locals.session as GatewaySession,
      headers: getForwardHeaders(req),
    });

    const items: PortalVisitHistoryItem[] = appointments
      .map((item) => mapAppointment(req, item))
      .filter((item) => item.status === "Seen")
      .map((item) => ({
        id: item.id,
        dateTime: item.dateTime,
        doctorName: item.doctorName,
        department: item.department,
        outcome: item.notes ?? "Visit completed in HMS.",
      }));

    res.json(items);
  }),
);

app.get(
  "/patient/notification-settings",
  requireSession,
  asyncRoute(async (req, res) => {
    const settings = await hmsRequest<HmsNotificationSettingsResponse>("/api/patient/notification-settings", {
      session: res.locals.session as GatewaySession,
      headers: getForwardHeaders(req),
    });
    res.json(mapNotificationSettings(settings));
  }),
);

app.patch(
  "/patient/notification-settings",
  requireSession,
  asyncRoute(async (req, res) => {
    const payload = hmsRequest<HmsNotificationSettingsResponse>("/api/patient/notification-settings", {
      method: "PATCH",
      body: {
        ...req.body,
      },
      session: res.locals.session as GatewaySession,
      headers: getForwardHeaders(req),
    });
    res.json(mapNotificationSettings(await payload));
  }),
);

app.post(
  "/patient/callback-request",
  requireSession,
  asyncRoute(async (req, res) => {
    const payload = callbackSchema.parse(req.body);
    const result = await hmsRequest<HmsTicketResponse>("/api/patient/callback-request", {
      method: "POST",
      body: payload,
      session: res.locals.session as GatewaySession,
      headers: getForwardHeaders(req),
    });
    res.json(result);
  }),
);

app.post(
  "/patient/support-ticket",
  requireSession,
  asyncRoute(async (req, res) => {
    const payload = supportTicketSchema.parse(req.body);
    const result = await hmsRequest<HmsTicketResponse>("/api/patient/support-ticket", {
      method: "POST",
      body: payload,
      session: res.locals.session as GatewaySession,
      headers: getForwardHeaders(req),
    });
    res.json(result);
  }),
);

app.get(
  "/patient/appointments",
  requireSession,
  asyncRoute(async (req, res) => {
    const rows = await hmsRequest<Array<Record<string, unknown>>>("/api/patient/appointments?limit=50", {
      session: res.locals.session as GatewaySession,
      headers: getForwardHeaders(req),
    });
    res.json(rows.map((item) => mapAppointment(req, item)));
  }),
);

app.get(
  "/patient/prescriptions",
  requireSession,
  asyncRoute(async (req, res) => {
    const rows = await hmsRequest<Array<Record<string, unknown>>>("/api/patient/prescriptions?limit=50", {
      session: res.locals.session as GatewaySession,
      headers: getForwardHeaders(req),
    });
    res.json(rows.map((item) => mapPrescription(req, item)));
  }),
);

app.get(
  "/patient/reports",
  requireSession,
  asyncRoute(async (req, res) => {
    const rows = await hmsRequest<Array<Record<string, unknown>>>("/api/patient/reports?limit=100", {
      session: res.locals.session as GatewaySession,
      headers: getForwardHeaders(req),
    });
    res.json(rows.map((item) => mapReport(req, item)));
  }),
);

app.get(
  "/patient/reports/:reportId/download",
  requireSession,
  asyncRoute(async (req, res) => {
    const session = res.locals.session as GatewaySession;
    const reports = await hmsRequest<Array<Record<string, unknown>>>("/api/patient/reports?limit=100", {
      session,
      headers: getForwardHeaders(req),
    });
    const match = reports.find((item) => String(item.id ?? item.report_id ?? "") === req.params.reportId);
    const downloadUrl = String(match?.download_url ?? "");

    if (!match || !downloadUrl) {
      res.status(404).json({ message: "Report not found." });
      return;
    }

    const upstream = await hmsFetch(downloadUrl, {
      session,
      headers: getForwardHeaders(req),
    });

    if (!upstream.ok) {
      throw new HmsHttpError(upstream.status, "Unable to download report.");
    }

    const contentType = upstream.headers.get("content-type") ?? "application/octet-stream";
    const reportId = String(req.params.reportId ?? "report");
    const disposition =
      upstream.headers.get("content-disposition") ??
      `attachment; filename="report-${encodeURIComponent(reportId)}.pdf"`;

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", disposition);
    const buffer = Buffer.from(await upstream.arrayBuffer());
    res.send(buffer);
  }),
);

app.get(
  "/patient/invoices",
  requireSession,
  asyncRoute(async (req, res) => {
    const rows = await hmsRequest<Array<Record<string, unknown>>>("/api/patient/invoices?limit=100", {
      session: res.locals.session as GatewaySession,
      headers: getForwardHeaders(req),
    });
    res.json(rows.map((item) => mapInvoice(req, item)));
  }),
);

app.get(
  "/patient/outstanding-amount",
  requireSession,
  asyncRoute(async (req, res) => {
    const rows = await hmsRequest<Array<Record<string, unknown>>>("/api/patient/invoices?limit=100", {
      session: res.locals.session as GatewaySession,
      headers: getForwardHeaders(req),
    });
    const total = rows.reduce((sum, row) => sum + (mapInvoice(req, row).status === "Unpaid" ? asNumber(row.total) : 0), 0);
    res.json(total);
  }),
);

app.get(
  "/patient/token-status",
  requireSession,
  asyncRoute(async (req, res) => {
    const snapshot = await hmsRequest<Record<string, unknown>>("/api/patient/token-status", {
      session: res.locals.session as GatewaySession,
      headers: getForwardHeaders(req),
    });
    res.json(mapTokenStatus(snapshot));
  }),
);

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof z.ZodError) {
    res.status(400).json({
      message: error.issues[0]?.message ?? "Invalid request.",
      issues: error.issues,
    });
    return;
  }

  if (error instanceof HmsHttpError) {
    res.status(error.status).json({ message: error.message });
    return;
  }

  const message = error instanceof Error ? error.message : "Internal server error.";
  res.status(500).json({ message });
});

app.listen(config.port, () => {
  console.log(`Patient gateway bridge listening on port ${config.port}`);
});
