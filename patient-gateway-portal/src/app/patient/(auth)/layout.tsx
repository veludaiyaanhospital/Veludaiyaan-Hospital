import type { Metadata } from "next";
import Image from "next/image";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Patient Access | Veludaiyaan Hospital",
};

export default function PatientAuthLayout({ children }: { children: React.ReactNode }) {
  const isGitHubPagesBuild =
    process.env.GITHUB_PAGES === "true" || process.env.GITHUB_ACTIONS === "true";
  const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] || "Veludaiyaan-Hospital";
  const basePath = isGitHubPagesBuild ? `/${repositoryName}` : "";
  const logoSrc = `${basePath}/LOGO.png`;

  return (
    <div className="portal-shell min-h-screen px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-2">
        <section className="hidden rounded-3xl border border-blue-100 bg-white/90 p-10 shadow-xl lg:block">
          <div className="flex flex-col items-start gap-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0f4ca0]">
              <Shield className="h-4 w-4" />
              Secure Patient Access
            </div>
            <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <Image
                alt="Veludaiyaan Hospital Logo"
                className="h-14 w-auto max-w-[320px] object-contain object-left"
                height={112}
                priority
                src={logoSrc}
                width={640}
              />
            </div>
          </div>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight text-slate-900">
            Patient Portal
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
        <section className="mx-auto w-full max-w-md">
          <div className="mb-4 inline-flex items-center rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm lg:hidden">
            <Image
              alt="Veludaiyaan Hospital Logo"
              className="h-12 w-auto max-w-[280px] object-contain object-left"
              height={96}
              priority
              src={logoSrc}
              width={560}
            />
          </div>
          {children}
        </section>
      </div>
    </div>
  );
}
