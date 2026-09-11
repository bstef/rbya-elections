import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-hairline bg-surface px-6 py-10 sm:px-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-red-50 dark:from-blue-950/50 dark:via-transparent dark:to-transparent"
      />
      <div className="relative">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-950 text-white dark:bg-blue-100 dark:text-blue-950">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6">
            <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
            <path
              d="M8 11V8a4 4 0 018 0v3"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <circle cx="12" cy="15.5" r="1.4" fill="currentColor" />
          </svg>
        </div>
        <p className="mt-4 text-sm font-semibold tracking-wide text-blue-800 uppercase dark:text-blue-200">
          Committee Access
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink font-sans sm:text-3xl">
          Election Committee Login
        </h1>
        <p className="mt-2 text-ink-muted">
          Admin accounts are provisioned by the committee directly and are
          not available via public sign-up.
        </p>
        <div className="mt-6">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
