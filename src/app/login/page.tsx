import { LoginForm } from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md">
      <div className="relative overflow-hidden rounded-2xl border border-hairline bg-surface px-6 py-10 sm:px-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-amber-50 dark:from-blue-950/50 dark:via-transparent dark:to-transparent"
        />
        <div className="relative">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-hairline bg-surface text-blue-950 dark:text-blue-100">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="h-6 w-6"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
              <path
                d="M4 7l8 6 8-6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="mt-4 text-sm font-semibold tracking-wide text-blue-800 uppercase dark:text-blue-200">
            Delegate Access
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink font-sans sm:text-3xl">
            Delegate Login
          </h1>
          <p className="mt-2 text-ink-muted">
            Enter the email your church registered you with. We&apos;ll send you
            a secure sign-in link -- no password needed.
          </p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
