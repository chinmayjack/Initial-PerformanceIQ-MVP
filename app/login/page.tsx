import Link from "next/link";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { getLoginOptions } from "@/lib/data";
import { getSessionContext } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams?: { error?: string } }) {
  const session = getSessionContext();
  const organizations = (await getLoginOptions()).filter((organization) => organization.users.length > 0);
  const activeOrganization = organizations.find((organization) => organization.slug === session.organizationSlug) ?? organizations[0];

  if (!activeOrganization) {
    redirect("/");
  }

  return (
    <main className="surface-band flex min-h-screen items-center justify-center px-5 py-10 text-white">
      <div className="w-full max-w-5xl overflow-hidden rounded-lg border border-white/15 bg-white/10 shadow-2xl backdrop-blur">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <section className="p-8 lg:p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-brand-700">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="text-lg font-bold">PerformanceIQ</div>
                <div className="text-xs text-blue-100">Pilot login</div>
              </div>
            </div>
            <h1 className="mt-10 text-4xl font-bold tracking-tight">Choose your workspace session.</h1>
            <p className="mt-4 text-sm leading-6 text-blue-50">
              This pilot login uses seeded workspace users so customers can test role-based performance workflows before SSO is connected.
            </p>
            <Link className="mt-8 inline-flex rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white" href="/">
              Back to public site
            </Link>
          </section>

          <section className="bg-white p-8 text-slate-950 lg:p-10">
            <h2 className="text-2xl font-bold">Sign in</h2>
            <p className="mt-2 text-sm text-slate-600">Select a company workspace and user role.</p>

            {searchParams?.error ? (
              <div className="mt-4 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                We could not start that session. Please choose a seeded user.
              </div>
            ) : null}

            <form className="mt-6 space-y-4" action="/api/auth/login" method="post">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Workspace</span>
                <select className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm" name="organizationSlug" defaultValue={activeOrganization.slug}>
                  {organizations.map((organization) => (
                    <option key={organization.id} value={organization.slug}>
                      {organization.name} ({organization.slug})
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">User</span>
                <select className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm" name="userEmail" defaultValue={activeOrganization.users[0]?.email}>
                  {activeOrganization.users.map((user) => (
                    <option key={user.id} value={user.email}>
                      {user.name} - {user.role.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </label>

              <button className="w-full rounded-md bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700" type="submit">
                Enter workspace
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
