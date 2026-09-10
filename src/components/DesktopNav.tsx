"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = { href: string; label: string; primary?: boolean };

const BASE_CLASSES = "whitespace-nowrap rounded-md border px-3 py-1.5 transition-colors";

const INFO_CLASSES =
  "border-hairline text-ink-muted hover:border-ink-faint hover:bg-surface-muted hover:text-ink";

const PRIMARY_CLASSES =
  "border-blue-200 bg-blue-50 text-blue-900 hover:border-blue-300 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100 dark:hover:bg-blue-950/70";

const ACTIVE_CLASSES = "border-transparent bg-blue-950 text-white dark:bg-blue-100 dark:text-blue-950";

export function DesktopNav({ links }: { links: NavLink[] }) {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-2 text-base font-medium xl:flex">
      {links.map((link) => {
        const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        const stateClasses = isActive ? ACTIVE_CLASSES : link.primary ? PRIMARY_CLASSES : INFO_CLASSES;

        return (
          <Link key={link.href} href={link.href} className={`${BASE_CLASSES} ${stateClasses}`}>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
