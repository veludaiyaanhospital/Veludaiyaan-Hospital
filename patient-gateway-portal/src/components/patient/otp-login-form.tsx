"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, Smartphone } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOtpAuth } from "@/hooks/use-auth";
import { DEFAULT_PROTECTED_ROUTE } from "@/lib/auth/paths";
import { canAccessPatientRoute } from "@/lib/auth/session";
import { useAuthStore } from "@/store/auth-store";

const otpRequestSchema = z.object({
  mobile: z
    .string()
    .min(10, "Enter a valid mobile number")
    .max(10, "Mobile number should be 10 digits")
    .regex(/^\d{10}$/, "Only digits are allowed"),
  uhid: z.string().optional(),
});

const otpVerifySchema = z.object({
  otp: z
    .string()
    .length(6, "OTP should be 6 digits")
    .regex(/^\d{6}$/, "Only digits are allowed"),
});

type OtpRequestValues = z.infer<typeof otpRequestSchema>;
type OtpVerifyValues = z.infer<typeof otpVerifySchema>;

export function OtpLoginForm() {
  const router = useRouter();
  const session = useAuthStore((state) => state.session);
  const otpState = useAuthStore((state) => state.otpState);

  const [step, setStep] = useState<"request" | "verify">(otpState ? "verify" : "request");
  const [identity, setIdentity] = useState<{ mobile: string; uhid?: string } | null>(
    otpState ? { mobile: otpState.mobile } : null,
  );

  const { requestOtpMutation, verifyOtpMutation } = useOtpAuth();

  const requestForm = useForm<OtpRequestValues>({
    resolver: zodResolver(otpRequestSchema),
    defaultValues: {
      mobile: otpState?.mobile ?? "",
      uhid: "",
    },
  });

  const verifyForm = useForm<OtpVerifyValues>({
    resolver: zodResolver(otpVerifySchema),
    defaultValues: {
      otp: "",
    },
  });

  const selectedMobile = useMemo(() => identity?.mobile ?? otpState?.mobile ?? "", [identity, otpState]);

  useEffect(() => {
    if (canAccessPatientRoute(session)) {
      router.replace(DEFAULT_PROTECTED_ROUTE);
    }
  }, [router, session]);

  const onRequestOtp = requestForm.handleSubmit(async (values) => {
    await requestOtpMutation.mutateAsync(values);
    setIdentity({ mobile: values.mobile, uhid: values.uhid });
    setStep("verify");
  });

  const onVerifyOtp = verifyForm.handleSubmit(async (values) => {
    await verifyOtpMutation.mutateAsync({
      mobile: selectedMobile,
      otp: values.otp,
      uhid: identity?.uhid,
    });
  });

  return (
    <Card className="border-slate-200 bg-white/95 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Patient Login</CardTitle>
        <CardDescription>Use mobile OTP to securely access your health information.</CardDescription>
      </CardHeader>
      <CardContent>
        {step === "request" ? (
          <form className="space-y-5" onSubmit={onRequestOtp}>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                inputMode="numeric"
                maxLength={10}
                placeholder="Enter 10-digit mobile"
                {...requestForm.register("mobile")}
              />
              <p className="text-xs text-rose-600">{requestForm.formState.errors.mobile?.message}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="uhid">Patient ID / UHID (Optional)</Label>
              <Input id="uhid" placeholder="VH-UHID-2026-01981" {...requestForm.register("uhid")} />
              <p className="text-xs text-rose-600">{requestForm.formState.errors.uhid?.message}</p>
            </div>
            <Button className="w-full" disabled={requestOtpMutation.isPending} type="submit">
              <Smartphone className="h-4 w-4" />
              {requestOtpMutation.isPending ? "Sending OTP..." : "Request OTP"}
            </Button>
            <p className="text-center text-sm text-slate-600">
              New patient? <Link className="font-semibold text-sky-700" href="/patient/register">Create access</Link>
            </p>
          </form>
        ) : (
          <form className="space-y-5" onSubmit={onVerifyOtp}>
            <div className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-800">
              OTP sent to <span className="font-semibold">{selectedMobile}</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                inputMode="numeric"
                maxLength={6}
                placeholder="6-digit OTP"
                {...verifyForm.register("otp")}
              />
              <p className="text-xs text-rose-600">{verifyForm.formState.errors.otp?.message}</p>
            </div>
            <Button className="w-full" disabled={verifyOtpMutation.isPending} type="submit">
              <ShieldCheck className="h-4 w-4" />
              {verifyOtpMutation.isPending ? "Verifying..." : "Verify and Continue"}
            </Button>
            <button
              className="w-full text-sm font-semibold text-slate-600 hover:text-slate-900"
              onClick={() => setStep("request")}
              type="button"
            >
              Change mobile number
            </button>
            <p className="text-center text-sm text-slate-600">
              Trouble logging in? <Link className="font-semibold text-sky-700" href="/patient/forgot-access">Recover access</Link>
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
