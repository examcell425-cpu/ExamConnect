import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

import ClientLayoutWrapper from "../components/ClientLayoutWrapper";

import { ThemeProvider } from "../components/ThemeProvider";

export const metadata: Metadata = {
  title: "Exam Connect — MNSK College of Engineering",
  description: "Online Examination Management System for MNSK College of Engineering. Manage exams, evaluate results, and track performance.",
};

// Force Next.js to dynamically render this layout on request.
// Prevent Netlify from aggressively saving a "stale" auth/theme state in static HTML.
export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider>
            <ClientLayoutWrapper>
              {children}
            </ClientLayoutWrapper>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
