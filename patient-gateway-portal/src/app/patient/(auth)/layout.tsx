import type { Metadata } from "next";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Patient Access | Veludaiyaan Hospital",
};

export default function PatientAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="portal-shell min-h-screen px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-2">
        <section className="hidden rounded-3xl border border-sky-100 bg-white/80 p-10 shadow-xl lg:block">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
            <Shield className="h-4 w-4" />
            Secure Patient Access
          </div>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight text-slate-900">
            Veludaiyaan Hospital Patient Gateway
          </h1>
          <p className="mt-4 max-w-xl text-base text-slate-600">
            View appointments, token queue, prescriptions, reports, and support in one secure portal.
          </p>
          <div className="mt-8 grid gap-3 text-sm text-slate-700">
            <p className="rounded-xl border border-slate-200 bg-white px-4 py-3">24x7 token and queue visibility</p>
            <p className="rounded-xl border border-slate-200 bg-white px-4 py-3">Prescription and report download history</p>
            <p className="rounded-xl border border-slate-200 bg-white px-4 py-3">Hospital support and callback in one place</p>
          </div>
        </section>
        <section className="mx-auto w-full max-w-md">{children}</section>
      </div>
    </div>
  );
}
