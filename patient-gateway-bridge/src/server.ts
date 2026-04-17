import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import { z } from "zod";

import { config } from "./config.js";
import { hmsRequest } from "./hms-client.js";
import { buildSessionCookie, sealSession, unsealSession, type GatewaySession } from "./session.js";

const app = express();

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

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

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
  res.cookie(config.sessionCookieName, sealSession(session), buildSessionCookie(session.expiresAt));
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

app.post(
  "/auth/request-otp",
  asyncRoute(async (req, res) => {
    const payload = otpRequestSchema.parse(req.body);
    const result = await hmsRequest<{
      requestId: string;
      maskedMobile: string;
      expiresInSeconds: number;
    }>("/auth/request-otp", {
      method: "POST",
      body: payload,
    });

    res.json(result);
  }),
);

app.post(
  "/auth/verify-otp",
  asyncRoute(async (req, res) => {
    const payload = otpVerifySchema.parse(req.body);
    const result = await hmsRequest<GatewaySession>("/auth/verify-otp", {
      method: "POST",
      body: payload,
    });

    setSessionCookie(res, result);
    res.json({
      token: "server-session",
      refreshToken: "server-session",
      expiresAt: result.expiresAt,
      patientId: result.patientId,
      role: result.role,
    });
  }),
);

app.post(
  "/auth/refresh",
  asyncRoute(async (req, res) => {
    const session = getSession(req);
    const refreshToken = typeof req.body?.refreshToken === "string" ? req.body.refreshToken : session?.refreshToken;

    if (!refreshToken) {
      res.status(401).json({ message: "Refresh token is missing." });
      return;
    }

    const result = await hmsRequest<GatewaySession>("/auth/refresh", {
      method: "POST",
      body: { refreshToken },
    });

    setSessionCookie(res, result);
    res.json({
      token: "server-session",
      refreshToken: "server-session",
      expiresAt: result.expiresAt,
      patientId: result.patientId,
      role: result.role,
    });
  }),
);

app.post(
  "/auth/logout",
  asyncRoute(async (req, res) => {
    const session = getSession(req);
    if (session) {
      try {
        await hmsRequest("/auth/logout", {
          method: "POST",
          session,
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
  asyncRoute(async (_req, res) => {
    res.json(await hmsRequest("/patient/me", { session: res.locals.session as GatewaySession }));
  }),
);

app.patch(
  "/patient/me",
  requireSession,
  asyncRoute(async (req, res) => {
    res.json(
      await hmsRequest("/patient/me", {
        method: "PATCH",
        body: req.body,
        session: res.locals.session as GatewaySession,
      }),
    );
  }),
);

app.get(
  "/patient/visit-history",
  requireSession,
  asyncRoute(async (_req, res) => {
    res.json(await hmsRequest("/patient/visit-history", { session: res.locals.session as GatewaySession }));
  }),
);

app.get(
  "/patient/notification-settings",
  requireSession,
  asyncRoute(async (_req, res) => {
    res.json(await hmsRequest("/patient/notification-settings", { session: res.locals.session as GatewaySession }));
  }),
);

app.patch(
  "/patient/notification-settings",
  requireSession,
  asyncRoute(async (req, res) => {
    res.json(
      await hmsRequest("/patient/notification-settings", {
        method: "PATCH",
        body: req.body,
        session: res.locals.session as GatewaySession,
      }),
    );
  }),
);

app.post(
  "/patient/callback-request",
  requireSession,
  asyncRoute(async (req, res) => {
    const payload = callbackSchema.parse(req.body);
    res.json(
      await hmsRequest("/patient/callback-request", {
        method: "POST",
        body: payload,
        session: res.locals.session as GatewaySession,
      }),
    );
  }),
);

app.post(
  "/patient/support-ticket",
  requireSession,
  asyncRoute(async (req, res) => {
    const payload = supportTicketSchema.parse(req.body);
    res.json(
      await hmsRequest("/patient/support-ticket", {
        method: "POST",
        body: payload,
        session: res.locals.session as GatewaySession,
      }),
    );
  }),
);

for (const path of [
  "/patient/appointments",
  "/patient/prescriptions",
  "/patient/reports",
  "/patient/invoices",
  "/patient/outstanding-amount",
  "/patient/token-status",
]) {
  app.get(
    path,
    requireSession,
    asyncRoute(async (_req, res) => {
      res.json(await hmsRequest(path, { session: res.locals.session as GatewaySession }));
    }),
  );
}

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof z.ZodError) {
    res.status(400).json({
      message: error.issues[0]?.message ?? "Invalid request.",
      issues: error.issues,
    });
    return;
  }

  const message = error instanceof Error ? error.message : "Internal server error.";
  res.status(500).json({ message });
});

app.listen(config.port, () => {
  console.log(`Patient gateway bridge listening on port ${config.port}`);
});
