"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Patient } from "@/lib/types";

const profileSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(1),
  age: z
    .string()
    .regex(/^\d+$/, "Age must be a number")
    .refine((value) => Number(value) > 0 && Number(value) <= 120, "Age should be between 1 and 120"),
  sex: z.enum(["Male", "Female", "Other"]),
  mobile: z.string().regex(/^\d{10}$/),
  uhid: z.string().min(5),
  bloodGroup: z.string().min(2),
  address: z.string().min(10),
  emergencyContact: z.string().min(8),
  primaryDoctor: z.string().min(2),
});

type ProfileValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  patient: Patient;
  onSubmit: (values: Partial<Patient>) => void;
  isSaving?: boolean;
}

export function ProfileForm({ patient, onSubmit, isSaving = false }: ProfileFormProps) {
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: patient.firstName,
      lastName: patient.lastName,
      age: String(patient.age),
      sex: patient.sex,
      mobile: patient.mobile,
      uhid: patient.uhid,
      bloodGroup: patient.bloodGroup,
      address: patient.address,
      emergencyContact: patient.emergencyContact,
      primaryDoctor: patient.primaryDoctor,
    },
  });

  useEffect(() => {
    form.reset({
      firstName: patient.firstName,
      lastName: patient.lastName,
      age: String(patient.age),
      sex: patient.sex,
      mobile: patient.mobile,
      uhid: patient.uhid,
      bloodGroup: patient.bloodGroup,
      address: patient.address,
      emergencyContact: patient.emergencyContact,
      primaryDoctor: patient.primaryDoctor,
    });
  }, [form, patient]);

  const submit = form.handleSubmit((values) => {
    onSubmit({
      ...values,
      age: Number(values.age),
    });
  });

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Patient Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" {...form.register("firstName")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...form.register("lastName")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" {...form.register("age")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sex">Sex</Label>
              <Input id="sex" {...form.register("sex")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile</Label>
              <Input id="mobile" inputMode="numeric" maxLength={10} {...form.register("mobile")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="uhid">UHID</Label>
              <Input id="uhid" {...form.register("uhid")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <Input id="bloodGroup" {...form.register("bloodGroup")} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...form.register("address")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input id="emergencyContact" {...form.register("emergencyContact")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primaryDoctor">Primary Doctor</Label>
              <Input id="primaryDoctor" {...form.register("primaryDoctor")} />
            </div>
          </div>
          <p className="text-sm text-rose-600">{Object.values(form.formState.errors)[0]?.message as string}</p>
          <Button disabled={isSaving} type="submit">
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
