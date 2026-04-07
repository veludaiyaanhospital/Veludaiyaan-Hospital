"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const registerSchema = z.object({
  fullName: z.string().min(3, "Enter your full name"),
  mobile: z.string().regex(/^\d{10}$/, "Enter valid 10-digit mobile"),
  uhid: z.string().optional(),
  dob: z.string().min(1, "Date of birth is required"),
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function PatientRegisterPage() {
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = form.handleSubmit(() => {
    toast.success("Registration request captured. Proceed with OTP login.");
  });

  return (
    <Card className="border-slate-200 bg-white/95 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Register Access</CardTitle>
        <CardDescription>Create your patient portal access profile.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" {...form.register("fullName")} />
            <p className="text-xs text-rose-600">{form.formState.errors.fullName?.message}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input id="mobile" inputMode="numeric" maxLength={10} {...form.register("mobile")} />
            <p className="text-xs text-rose-600">{form.formState.errors.mobile?.message}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="uhid">Patient ID / UHID (Optional)</Label>
            <Input id="uhid" {...form.register("uhid")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input id="dob" type="date" {...form.register("dob")} />
            <p className="text-xs text-rose-600">{form.formState.errors.dob?.message}</p>
          </div>
          <Button className="w-full" type="submit">
            Submit Registration
          </Button>
          <p className="text-center text-sm text-slate-600">
            Already registered? <Link className="font-semibold text-sky-700" href="/patient/login">Go to login</Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
