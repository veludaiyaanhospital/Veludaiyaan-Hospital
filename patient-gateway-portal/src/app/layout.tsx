import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import { AppProvider } from "@/components/providers/app-provider";

import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const isGitHubPagesBuild = process.env.GITHUB_PAGES === "true";
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] || "Veludaiyaan-Hospital";
const basePath = isGitHubPagesBuild ? `/${repositoryName}` : "";
const iconHref = `${basePath}/logo1.jpg`;

export const metadata: Metadata = {
  title: "Veludaiyaan Hospital Patient Portal",
  description:
    "Patient Portal for appointments, token status, prescriptions, reports, and support.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-snippet": -1,
      "max-image-preview": "none",
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: iconHref,
    shortcut: iconHref,
    apple: iconHref,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-50 font-sans text-slate-900">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
