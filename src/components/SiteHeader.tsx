import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MobileNav } from "@/components/MobileNav";
import { DesktopNav } from "@/components/DesktopNav";

// "primary" marks the two actual calls to action during election season
// (Nominate, Register Delegates) so they read as different from the plain
// informational links instead of every nav item looking identical.
const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/candidates", label: "Candidates" },
  { href: "/nominate", label: "Nominate", primary: true },
  { href: "/delegates/register", label: "Register Delegates", primary: true },
  { href: "/results", label: "Results" },
  { href: "/archive", label: "Archive" },
  { href: "/about", label: "About" },
];

// Gold, matching the Romanian flag's yellow stripe (same accent used in the
// header's bottom gradient below) -- bright enough to read in both themes
// without a dark: override, unlike the navy admin button.
export const LOGIN_BUTTON_CLASSES =
  "rounded-md bg-amber-400 px-4 py-2 text-sm font-medium text-blue-950 transition-colors hover:bg-amber-300";

// Navy, matching the brand/logo color -- a genuinely different color from
// Delegate Login (not just outline vs. filled) so the two audiences read as
// distinct actions rather than variations on the same one.
export const ADMIN_LOGIN_BUTTON_CLASSES =
  "rounded-md bg-blue-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800 dark:bg-blue-100 dark:text-blue-950 dark:hover:bg-blue-200";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-surface/95 backdrop-blur supports-backdrop-filter:bg-surface/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="shrink-0">
          {/* The mark's navy ink only reads against a light backdrop, so dark
              mode swaps to the flattened white-background export inside a
              white badge instead of the transparent one going invisible. */}
          <Image
            src="/rbyaelectionstransparent.png"
            alt="RBYA Elections"
            width={1910}
            height={823}
            priority
            className="h-14 w-auto dark:hidden sm:h-16"
          />
          <span className="hidden rounded-lg bg-white p-1.5 dark:flex sm:p-2">
            <Image
              src="/rbyaelectionswhite.png"
              alt="RBYA Elections"
              width={1774}
              height={887}
              priority
              className="h-11 w-auto sm:h-12"
            />
          </span>
        </Link>

        <DesktopNav links={NAV_LINKS} />

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
