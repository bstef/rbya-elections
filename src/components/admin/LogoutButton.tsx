"use client";

import { useTransition } from "react";
import { adminLogout } from "@/app/admin/login/actions";

export function LogoutButton({ className = "" }: { className?: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => adminLogout())}
      className={`whitespace-nowrap rounded-md px-3 py-2 text-left text-sm font-medium text-ink-muted hover:bg-surface-muted disabled:opacity-60 ${className}`}
    >
      {isPending ? "Logging out..." : "Log out"}
    </button>
  );
}
