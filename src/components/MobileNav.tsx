"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function MobileNav({
  links,
}: {
  links: { href: string; label: string; primary?: boolean }[];
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-hairline bg-surface text-ink-muted hover:bg-page"
      >
        {open ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-12 z-20 w-56 rounded-lg border border-hairline bg-surface p-2 shadow-lg">
            {links.map((link) => {
              const isActive =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-md px-3 py-2.5 text-base font-medium transition-colors ${
                    isActive
                      ? "bg-blue-950 text-white dark:bg-blue-100 dark:text-blue-950"
                      : link.primary
                        ? "text-blue-900 hover:bg-blue-50 dark:text-blue-200 dark:hover:bg-blue-950/40"
                        : "text-ink-muted hover:bg-page hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="my-2 border-t border-hairline" />
            <div className="flex flex-col gap-2">
              <Link
                href="/admin/login"
                onClick={() => setOpen(false)}
                className="block rounded-md border border-blue-950 px-3 py-2 text-center text-sm font-medium text-blue-950 hover:bg-blue-950 hover:text-white dark:border-blue-100 dark:text-blue-100 dark:hover:bg-blue-100 dark:hover:text-blue-950"
              >
                Committee Login
              </Link>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block rounded-md bg-blue-950 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 dark:bg-blue-100 dark:text-blue-950 dark:hover:bg-blue-200"
              >
                Delegate Login
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
