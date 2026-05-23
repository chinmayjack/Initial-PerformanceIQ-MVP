"use client";

import Link from "next/link";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-12">
      <div className="metric-card">
        <div className="text-sm font-semibold uppercase tracking-wide text-rose-600">Production error</div>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">PerformanceIQ could not load this page.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          This usually means a required Vercel environment variable is missing or the database connection failed.
        </p>
        {error.digest ? (
          <div className="mt-4 rounded-md bg-slate-100 p-3 text-sm text-slate-700">Digest: {error.digest}</div>
        ) : null}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white" type="button" onClick={reset}>
            Retry
          </button>
          <Link className="rounded-md border border-slate-200 bg-white px-4 py-2 text-center text-sm font-semibold text-slate-700" href="/">
            Go to landing page
          </Link>
        </div>
      </div>
    </main>
  );
}
