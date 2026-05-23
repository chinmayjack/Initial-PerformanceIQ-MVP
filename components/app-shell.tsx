"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BrainCircuit, BriefcaseBusiness, Building2, ClipboardList, Home, LogOut, MessageSquareText, ShieldCheck, Sparkles, Target, Users } from "lucide-react";
import { Role } from "@/lib/types";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/employees", label: "Employees", icon: Users },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/feedback", label: "Feedback", icon: MessageSquareText },
  { href: "/insights", label: "AI Insights", icon: BrainCircuit },
  { href: "/career", label: "Career", icon: BriefcaseBusiness },
  { href: "/reviews", label: "Reviews", icon: ClipboardList },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/workspace", label: "Workspace", icon: Building2 }
];

export function AppShell({
  children,
  session
}: {
  children: React.ReactNode;
  session: {
    userName: string;
    userRole: Role;
    organizationSlug: string;
  };
}) {
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-slate-900/30 bg-slate-950 text-white shadow-2xl lg:block">
        <div className="surface-band flex h-20 items-center border-b border-white/10 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-brand-700 shadow-soft">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-bold">PerformanceIQ</div>
              <div className="text-xs text-blue-100">Enterprise performance OS</div>
            </div>
            </div>
        </div>
        <div className="mx-4 mt-5 rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-teal-200">
            <ShieldCheck className="h-4 w-4" />
            Live PostgreSQL
          </div>
          <p className="mt-2 text-sm leading-5 text-slate-300">Workspace: {session.organizationSlug}. Prisma-backed tenant data with AI-ready insight generation.</p>
        </div>
        <nav className="space-y-1 px-3 py-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                  active ? "bg-white text-slate-950 shadow-sm" : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-white/60 bg-white/80 shadow-sm backdrop-blur">
          <div className="flex min-h-16 flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <div className="text-sm font-semibold text-slate-950">{session.userName}</div>
              <div className="text-xs text-slate-500">Workspace: {session.organizationSlug} - {session.userRole.replace("_", " ")}</div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Live PostgreSQL
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-brand-600" />
                Market-ready MVP
              </div>
              <Link href="/api/auth/logout" className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm">
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </Link>
            </div>
            <div className="flex gap-2 overflow-x-auto lg:hidden">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="whitespace-nowrap rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
