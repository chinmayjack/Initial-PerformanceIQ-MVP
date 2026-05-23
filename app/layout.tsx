import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { getSessionContext } from "@/lib/session";
import "./globals.css";

export const metadata: Metadata = {
  title: "PerformanceIQ",
  description: "AI-powered employee performance management MVP"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const sessionContext = getSessionContext();

  return (
    <html lang="en">
      <body>
        <AppShell
          session={{
            userName: sessionContext.userName,
            userRole: sessionContext.userRole,
            organizationSlug: sessionContext.organizationSlug
          }}
        >
          {children}
        </AppShell>
      </body>
    </html>
  );
}
