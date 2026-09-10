import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MobileNav } from "@/components/MobileNav";
import { RbyaLogo } from "@/components/RbyaLogo";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/candidates", label: "Candidates" },
  { href: "/nominate", label: "Nominate" },
  { href: "/delegates/register", label: "Register Delegates" },
  { href: "/results", label: "Results" },
  { href: "/archive", label: "Archive" },
  { href: "/about", label: "About" },
];

const NAV_LINK_CLASSES =
  "whitespace-nowrap rounded-md border border-hairline px-3 py-1.5 text-ink-muted transition-colors hover:border-ink-faint hover:bg-surface-muted hover:text-ink";

export const LOGIN_BUTTON_CLASSES =
  "rounded-md bg-blue-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800 dark:bg-blue-100 dark:text-blue-950 dark:hover:bg-blue-200";

// Secondary to Delegate Login (outlined vs. filled navy) so both read as
// real buttons without looking like the same action.
const ADMIN_LOGIN_BUTTON_CLASSES =
  "rounded-md border border-blue-950 px-4 py-2 text-sm font-medium text-blue-950 transition-colors hover:bg-blue-950 hover:text-white dark:border-blue-100 dark:text-blue-100 dark:hover:bg-blue-100 dark:hover:text-blue-950";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-surface/95 backdrop-blur supports-backdrop-filter:bg-surface/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="shrink-0">
          <RbyaLogo className="h-11 w-auto sm:h-14" />
        </Link>

        <nav className="hidden items-center gap-2 text-base font-medium xl:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={NAV_LINK_CLASSES}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <Link href="/admin/login" className={`${ADMIN_LOGIN_BUTTON_CLASSES} whitespace-nowrap`}>
            Committee Login
          </Link>
          <Link href="/login" className={`${LOGIN_BUTTON_CLASSES} whitespace-nowrap`}>
            Delegate Login
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <ThemeToggle />
          <MobileNav links={NAV_LINKS} />
        </div>
      </div>

      {/* Subtle nod to the Romanian flag -- thin, not a design centerpiece. */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-800 via-amber-400 to-red-600" />
    </header>
  );
}
