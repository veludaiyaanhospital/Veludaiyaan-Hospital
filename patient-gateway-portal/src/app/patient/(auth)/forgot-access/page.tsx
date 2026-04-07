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

const forgotSchema = z.object({
  mobile: z.string().regex(/^\d{10}$/, "Enter valid mobile number"),
  uhid: z.string().optional(),
});

type ForgotValues = z.infer<typeof forgotSchema>;

export default function ForgotAccessPage() {
  const form = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = form.handleSubmit(() => {
    toast.success("Access recovery request sent. Our team will contact you.");
  });

  return (
    <Card className="border-slate-200 bg-white/95 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Forgot Access</CardTitle>
        <CardDescription>Recover your patient portal login details.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="mobile">Registered Mobile</Label>
            <Input id="mobile" inputMode="numeric" maxLength={10} {...form.register("mobile")} />
            <p className="text-xs text-rose-600">{form.formState.errors.mobile?.message}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="uhid">Patient ID / UHID (Optional)</Label>
            <Input id="uhid" {...form.register("uhid")} />
          </div>
          <Button className="w-full" type="submit">
            Submit Recovery Request
          </Button>
          <p className="text-center text-sm text-slate-600">
            Back to <Link className="font-semibold text-sky-700" href="/patient/login">OTP login</Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
